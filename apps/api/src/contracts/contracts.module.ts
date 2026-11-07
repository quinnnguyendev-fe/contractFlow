import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module.js';
import { ContractsController } from './contracts.controller.js';
import { ContractsService } from './contracts.service.js';

@Module({
  imports: [OrganizationModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}