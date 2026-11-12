import { Module } from '@nestjs/common';
import { AuditLogsController } from './audit-logs.controller.js';
import { AuditLogsService } from './audit-logs.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, OrganizationContextService]
})
export class AuditLogsModule {}
