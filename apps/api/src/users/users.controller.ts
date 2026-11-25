import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { UsersService } from './users.service.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator/roles.decorator.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.sub);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user.sub, dto);
  }
}
