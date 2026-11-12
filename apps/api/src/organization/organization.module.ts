import { Module } from '@nestjs/common';
import { OrganizationContextService } from './organization-context/organization-context.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [OrganizationContextService],
  exports: [OrganizationContextService],
})
export class OrganizationModule {}
