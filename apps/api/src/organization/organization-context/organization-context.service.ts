import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class OrganizationContextService {
    constructor (private readonly prisma: PrismaService) {}

    async getOrganizationIds(id: string): Promise<string[]> {
        const memberships = await this.prisma.membership.findMany({
            where: {
                userId: id,
            },
            select: {
                organizationId: true,
            },
        });

        if(memberships.length === 0) {
            throw new UnauthorizedException('User does not belong to any organization')
        }

        return memberships.map((membership) => membership.organizationId);
    }
}
