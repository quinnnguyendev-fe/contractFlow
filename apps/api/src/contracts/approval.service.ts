import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApprovalDto } from './dto/create-approval.dto/create-approval.dto.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { UpdateApprovalDto } from './dto/update-approval.dto/update-approval.dto.js';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContextService: OrganizationContextService,
  ) {}

  async create(actorId: string, contractId: string, dto: CreateApprovalDto) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(actorId);

    const contract = await this.prisma.contract.findFirst({
      where: {
        id: contractId,
        organizationId: {
          in: organizationIds,
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.status !== 'PENDING') {
      throw new ConflictException(
        'Approvals can only be created for pending contracts',
      );
    }

    const approverMembership = await this.prisma.membership.findFirst({
      where: {
        userId: dto.approverId,
        organizationId: contract.organizationId,
      },
    });

    if (!approverMembership) {
      throw new ConflictException('User is not a member of the organization');
    }

    const existingApproval = await this.prisma.approval.findFirst({
      where: {
        contractId: contract.id,
        approverId: dto.approverId,
        status: 'PENDING',
      },
    });

    if (existingApproval) {
      throw new ConflictException(
        'A pending approval already exists for this approver',
      );
    }

    const approval = await this.prisma.$transaction(async (tx) => {
      const created = await tx.approval.create({
        data: {
          contractId: contract.id,
          approverId: dto.approverId,
          status: 'PENDING',
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: contract.organizationId,
          actorId,
          action: 'APPROVAL_CREATED',
          entityType: 'APPROVAL',
          entityId: created.id,
          metadata: {
            contractId: contract.id,
            approverId: dto.approverId,
          },
        },
      });

      return created;
    });

    return approval;
  }

  async findAll(actorId: string, contractId: string) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(actorId);

    const contract = await this.prisma.contract.findFirst({
      where: {
        id: contractId,
        organizationId: {
          in: organizationIds,
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const approvals = await this.prisma.approval.findMany({
      where: {
        contractId: contract.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return approvals;
  }

  async update(
    contractId: string,
    actorId: string,
    dto: UpdateApprovalDto,
    approvalId: string,
  ) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(actorId);

    const contract = await this.prisma.contract.findFirst({
      where: {
        id: contractId,
        organizationId: {
          in: organizationIds,
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const approval = await this.prisma.approval.findFirst({
      where: {
        id: approvalId,
        contractId: contract.id,
      },
    });

    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    if (approval.approverId !== actorId) {
      throw new ForbiddenException(
        'Only the assigned approver can update this approval',
      );
    }

    if (approval.status !== 'PENDING') {
      throw new ConflictException('Only pending approvals can be updated');
    }

    if (dto.status !== 'APPROVED' && dto.status !== 'REJECTED') {
      throw new ConflictException('Approval can only be approved or rejected');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedApproval = await tx.approval.update({
        where: {
          id: approval.id,
        },
        data: {
          status: dto.status,
          comment: dto.comment,
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: contract.organizationId,
          actorId,
          action: 'APPROVAL_STATUS_CHANGED',
          entityType: 'Approval',
          entityId: approval.id,
          metadata: {
            contractId: contract.id,
            fromStatus: approval.status,
            toStatus: dto.status,
            comment: dto.comment ?? null,
          },
        },
      });

      if (dto.status === 'APPROVED') {
        const [totalApprovals, nonApprovedApprovals] = await Promise.all([
          tx.approval.count({
            where: {
              contractId: contract.id,
            },
          }),

          tx.approval.count({
            where: {
              contractId: contract.id,
              status: {
                not: 'APPROVED',
              },
            },
          }),
        ]);

        if (totalApprovals > 0 && nonApprovedApprovals === 0) {
          const updatedContract = await tx.contract.update({
            where: {
              id: contract.id,
            },
            data: {
              status: 'ACTIVE',
            },
          });

          await tx.auditLog.create({
            data: {
              organizationId: contract.organizationId,
              actorId,
              action: 'CONTRACT_STATUS_CHANGED',
              entityType: 'Contract',
              entityId: contract.id,
              metadata: {
                contractId: contract.id,
                fromStatus: contract.status,
                toStatus: 'ACTIVE',
                reason: 'ALL_APPROVALS_APPROVED',
              },
            },
          });

          return {
            contract: updatedContract,
            approval: updatedApproval,
          };
        }
      }

      return {
        approval: updatedApproval,
        contract: null,
      };
    });
  }
}
