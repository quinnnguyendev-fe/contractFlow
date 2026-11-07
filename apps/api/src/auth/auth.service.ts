import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto/login.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email
            },
            include: {
                memberships: true
            }
        });

        if(!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const passwordValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash
        )

        if(!passwordValid) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        if(user.memberships.length === 0) {
            throw new UnauthorizedException('User does not belong to any organization')
        }

        const membership = user.memberships[0]

        const payload = {
            sub: user.id,
            email: user.email,
            organizationId: membership.organizationId,
            role: membership.role
        }

        return {
            accessToken: await this.jwtService.signAsync(payload)
        }
    }
}
