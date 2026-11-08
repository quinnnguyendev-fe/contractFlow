import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { CreateContractDto } from './dto/create-contract.dto/create-contract.dto.js';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContextService: OrganizationContextService,
  ) {}

  async findAll(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: {
        userId,
      },
      select: {
        organizationId: true,
      },
    });

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

  async create(organizationId: string, dto: CreateContractDto) {
    try {
      return await this.prisma.contract.create({
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
}
