import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { CreateContractDto } from './dto/create-contract.dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto/update-contract.dto.js';
import { QueryContractDto } from './dto/query-contract.dto/query-contract.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContextService: OrganizationContextService,
  ) {}

  async findAll(userId: string, query: QueryContractDto) {
    const organizationIds =
      await this.organizationContextService.getOrganizationIds(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractWhereInput = {
      organizationId: {
        in: organizationIds,
      },
      ...(query.status
        ? {
            status: query.status,
          }
        : {
            status: {
              not: 'ARCHIVED',
            },
          }),
      ...(query.search
        ? {
            OR: [
              {
                contractNumber: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                counterparty: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [total, contracts] = await this.prisma.$transaction([
      this.prisma.contract.count({
        where,
      }),
      this.prisma.contract.findMany({
        where,
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: contracts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    const nextStartDate =
      dto.startDate !== undefined
        ? new Date(dto.startDate)
        : contract.startDate;
    const nextEndDate =
      dto.endDate !== undefined ? new Date(dto.endDate) : contract.endDate;

    if (nextEndDate <= nextStartDate) {
      throw new BadRequestException('EndDate must be after StartDate');
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
