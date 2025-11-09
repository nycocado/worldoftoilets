import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@common/decorators/requires-permissions.decorator';
import { PermissionApiName } from '@database/entities/permission.entity';
import { RequestUser } from '@common/types/jwt.types';
import { UserService } from '@modules/user';

export const PERMISSIONS_EXCEPTIONS = {
  USER_NOT_HAVE_REQUIRED_PERMISSIONS:
    'User does not have the required permissions',
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionApiName[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException(
        PERMISSIONS_EXCEPTIONS.USER_NOT_HAVE_REQUIRED_PERMISSIONS,
      );
    }

    const hasPermission = await this.userService.verifyUserHasPermissions(
      user.id,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        PERMISSIONS_EXCEPTIONS.USER_NOT_HAVE_REQUIRED_PERMISSIONS,
      );
    }

    return true;
  }
}
