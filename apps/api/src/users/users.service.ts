
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly organizationContext: OrganizationContextService
    ) {}

    async findAll(userId: string) {
        const organizationIds = await this.organizationContext.getOrganizationIds(userId)

        return this.prisma.user.findMany({
            where: {
                memberships: {
                    some: {
                        organizationId: {
                            in: organizationIds
                        }
                    }
                }
            },
            select: {
                id: true,
                email: true,
                memberships: {
                    where: {
                        organizationId: {
                            in: organizationIds
                        }
                    },
                    select: {
                        role: true,
                        organizationId: true
                    }
                }
            },
            orderBy: {
                email: 'asc'
            }
        })

    }
}
