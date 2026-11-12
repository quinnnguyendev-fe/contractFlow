import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { QueryAuditLogDto } from './dto/query-audit-log.dto/query-audit-log.dto.js';

@Injectable()
export class AuditLogsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly organizationContextService: OrganizationContextService
    ) {}

    async findAll(userId: string, query: QueryAuditLogDto) {
        const organizationIds = await this.organizationContextService.getOrganizationIds(userId)
        const page = query.page ?? 1
        const limit = query.limit ?? 20
        const skip = (page - 1) * limit

        const where = {
            organizationId: {
                in: organizationIds
            },
            ...(query.action && { action: query.action }),
            ...(query.entityType && { entityType: query.entityType }),
            ...(query.entityId && { entityId: query.entityId })
        }

        const orderBy = {
            createdAt: query.sortOrder ?? 'desc'
        }

        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            this.prisma.auditLog.count({
                where
            })
        ])

        return {
            data,
            meta: {
                page, limit, total, totalPages: Math.ceil(total / limit)
            }
        }
    }
}
