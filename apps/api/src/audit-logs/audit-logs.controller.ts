import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { AuditLogsService } from './audit-logs.service.js';
import { QueryAuditLogDto } from './dto/query-audit-log.dto/query-audit-log.dto.js';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
    constructor (private readonly auditLogsService: AuditLogsService) {}

    @Get()
    findAll(
        @Req() req: {user: {userId: string}},
        @Query() query: QueryAuditLogDto
    ) {
        return this.auditLogsService.findAll(req.user.userId, query);
    }
}
