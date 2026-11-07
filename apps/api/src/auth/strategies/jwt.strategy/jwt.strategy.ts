import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from "../../../generated/prisma/enums.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
        })
    }

    async validate(payload: {
        sub: string
        email: string
        organizationId: string
        role: Role
    }) {
        return {
            userId: payload.sub,
            email: payload.email,
            organizationId: payload.organizationId,
            role: payload.role
        }
    }
}
