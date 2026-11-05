import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service.js';
import { ContractsController } from './contracts.controller.js';

@Module({
  providers: [ContractsService],
  controllers: [ContractsController]
})
export class ContractsModule {}
