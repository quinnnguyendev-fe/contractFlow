import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';

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
}
