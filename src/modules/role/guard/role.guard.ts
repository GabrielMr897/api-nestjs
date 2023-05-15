import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from 'src/modules/auth/model/auth-request';
import { AuthRepository } from 'src/modules/auth/repository/auth-repository';
import { ROLES_KEY } from '../decorator/role.decorator';
import { UserRole } from '../enum/userRoles';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const hasRequiredRole = await this.authRepository.validateRoles(
      request.user,
      requiredRoles,
    );

    return hasRequiredRole;
  }
}
