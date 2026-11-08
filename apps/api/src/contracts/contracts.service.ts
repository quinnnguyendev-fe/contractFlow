import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { CreateContractDto } from './dto/create-contract.dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto/update-contract.dto.js';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContextService: OrganizationContextService,
  ) {}

  async findAll(userId: string) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(userId);

    return this.prisma.contract.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, contractId: string) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(userId);

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
    return contract;
  }

  async create(
    actorId: string,
    organizationId: string,
    dto: CreateContractDto,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const contract = await tx.contract.create({
          data: {
            organizationId,
            contractNumber: dto.contractNumber,
            title: dto.title,
            counterparty: dto.counterparty,
            contractType: dto.contractType,
            value: dto.value,
            currency: dto.currency,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
          },
        });

        await tx.auditLog.create({
          data: {
            organizationId,
            actorId,
            action: 'CONTRACT_CREATED',
            entityType: 'CONTRACT',
            entityId: contract.id,
            metadata: {
              contractNumber: contract.contractNumber,
              title: contract.title,
            },
          },
        });

        return contract;
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Contract number already exists in this organization',
        );
      }

      throw error;
    }
  }

  async update(actorId: string, contractId: string, dto: UpdateContractDto) {
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

    return this.prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: {
          id: contract.id,
        },

        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.counterparty !== undefined && {
            counterparty: dto.counterparty,
          }),
          ...(dto.contractType !== undefined && {
            contractType: dto.contractType,
          }),
          ...(dto.value !== undefined && { value: dto.value }),
          ...(dto.currency !== undefined && { currency: dto.currency }),
          ...(dto.startDate !== undefined && {
            startDate: new Date(dto.startDate),
          }),
          ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
        },
      });
      await tx.auditLog.create({
        data: {
          organizationId: contract.organizationId,
          actorId,
          action: 'CONTRACT_UPDATED',
          entityType: 'CONTRACT',
          entityId: contract.id,
          metadata: {
            contractNumber: contract.contractNumber,
            updatedFields: Object.keys(dto),
          },
        },
      });

      return updatedContract;
    });
  }

  async archive(actorId: string, contractId: string) {
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

    if (contract.status === 'ARCHIVED') {
      throw new ConflictException('Contract is already archived');
    }

    return this.prisma.$transaction(async (tx) => {
      const archivedContract = await tx.contract.update({
        where: {
          id: contract.id,
        },
        data: {
          status: 'ARCHIVED',
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: contract.organizationId,
          actorId,
          action: 'CONTRACT_ARCHIVED',
          entityType: 'CONTRACT',
          entityId: contract.id,
          metadata: {
            contractNumber: contract.contractNumber,
          },
        },
      });

      return archivedContract;
    });
  }
}
