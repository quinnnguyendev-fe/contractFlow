import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator/roles.decorator.js';
import { CreateContractDto } from './dto/create-contract.dto/create-contract.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    organizationId: string;
    role: Role;
  };
}

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.MEMBER, Role.ADMIN, Role.VIEWER)
  findAll(@Req() request: AuthenticatedRequest) {
    return this.contractsService.findAll(request.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateContractDto) {
    return this.contractsService.create(request.user.organizationId, dto);
  }
}
