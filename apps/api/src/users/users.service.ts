import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrganizationContextService } from '../organization/organization-context/organization-context.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService,
  ) {}

  async findAll(userId: string) {
    const organizationIds =
      await this.organizationContext.getOrganizationIds(userId);

    return this.prisma.user.findMany({
      where: {
        memberships: {
          some: {
            organizationId: {
              in: organizationIds,
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        memberships: {
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
          select: {
            role: true,
            organizationId: true,
          },
        },
      },
      orderBy: {
        email: 'asc',
      },
    });
  }

  async create(userId: string, dto: CreateUserDto) {
    const organizationIds =
      await this.organizationContext.getOrganizationIds(userId);
    const organizationId = organizationIds[0];
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        memberships: {
          create: {
            organizationId: organizationId,
            role: dto.role,
          },
        },
      },
      select: {
        id: true,
        email: true,
        memberships: {
          where: {
            organizationId,
          },
          select: {
            role: true,
            organizationId: true,
          },
        },
      },
    });
  }
}
