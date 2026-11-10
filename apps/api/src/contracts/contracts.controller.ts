import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContractsService } from './contracts.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator/roles.decorator.js';
import { CreateContractDto } from './dto/create-contract.dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto/update-contract.dto.js';
import { QueryContractDto } from './dto/query-contract.dto/query-contract.dto.js';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto/update-contract-status.dto.js';
import { CreateApprovalDto } from './dto/create-approval.dto/create-approval.dto.js';
import { ApprovalService } from './approval.service.js';
import { UpdateApprovalDto } from './dto/update-approval.dto/update-approval.dto.js';

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
  constructor(
    private readonly contractsService: ContractsService,
    private readonly approvalService: ApprovalService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.MEMBER, Role.ADMIN, Role.VIEWER)
  findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: QueryContractDto,
  ) {
    return this.contractsService.findAll(request.user.userId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.MEMBER, Role.ADMIN, Role.VIEWER)
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.contractsService.findOne(request.user.userId, id);
  }

  @Get(':id/approvals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.MEMBER, Role.ADMIN, Role.VIEWER)
  findAllApprovals(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.approvalService.findAll(request.user.userId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateContractDto) {
    return this.contractsService.create(
      request.user.userId,
      request.user.organizationId,
      dto,
    );
  }

  @Post(':id/approvals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  createApproval(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateApprovalDto,
  ) {
    return this.approvalService.create(request.user.userId, id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
  ) {
    return this.contractsService.update(request.user.userId, id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateContractStatusDto,
  ) {
    return this.contractsService.updateStatus(request.user.userId, id, dto);
  }

  @Patch(':id/approvals/:approvalId')
  @UseGuards(JwtAuthGuard)
  updateApproval(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('approvalId') approvalId: string,
    @Body() dto: UpdateApprovalDto,
  ) {
    return this.approvalService.update(
      id,
      request.user.userId,
      dto,
      approvalId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  archived(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.contractsService.archive(request.user.userId, id);
  }
}
