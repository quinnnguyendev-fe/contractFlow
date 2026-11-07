import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../../generated/prisma/enums.js';
import { ROLES_KEY } from '../../decorators/roles.decorator/roles.decorator.js';

interface AuthenticatedRequest {
  user: {
    userId: string,
    email: string,
    organizationId: string,
    role: Role
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if(!requiredRoles || requiredRoles.length === 0) return true

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const user = request.user

    return requiredRoles.includes(user.role)
  }
}
