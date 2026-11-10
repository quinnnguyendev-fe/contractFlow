import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module.js';
import { ContractsController } from './contracts.controller.js';
import { ContractsService } from './contracts.service.js';
import { ApprovalService } from './approval.service.js';

@Module({
  imports: [OrganizationModule],
  controllers: [ContractsController],
  providers: [ContractsService, ApprovalService],
})
export class ContractsModule {}