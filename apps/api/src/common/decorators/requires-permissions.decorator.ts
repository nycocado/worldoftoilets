import { SetMetadata } from '@nestjs/common';
import { PermissionApiName } from '@database/entities/permission.entity';

export const PERMISSIONS_KEY = 'permissions';
export const RequiresPermissions = (...permissions: PermissionApiName[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
