import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { ContractsModule } from './contracts/contracts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OrganizationContextService } from './organization/organization-context/organization-context.service.js';
import { OrganizationModule } from './organization/organization.module.js';
import { AuditLogsModule } from './audit-logs/audit-logs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ContractsModule,
    AuthModule,
    OrganizationModule,
    AuditLogsModule,
  ],
  providers: [OrganizationContextService],
})
export class AppModule {}