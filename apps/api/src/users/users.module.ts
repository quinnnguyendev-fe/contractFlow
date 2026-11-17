import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationModule } from '../organization/organization.module.js';

@Module({
  imports: [PrismaModule, OrganizationModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}