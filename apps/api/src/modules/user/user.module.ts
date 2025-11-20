import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@database/entities';
import { RoleModule } from '@modules/role';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  GetUserSelfUseCase,
  UpdateUserSelfUseCase,
  DeleteUserSelfUseCase,
  GetUsersManageUseCase,
  GetUserManageUseCase,
  UpdateUserManageUseCase,
  DeleteUserManageUseCase,
  UndeleteUserManageUseCase,
  AssignRolesManageUseCase,
  RemoveRolesManageUseCase,
} from './use-cases';

/**
 * Gerencia a funcionalidade de utilizadores, agrupando seus componentes.
 */
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    GetUserSelfUseCase,
    UpdateUserSelfUseCase,
    DeleteUserSelfUseCase,
    GetUsersManageUseCase,
    GetUserManageUseCase,
    UpdateUserManageUseCase,
    DeleteUserManageUseCase,
    UndeleteUserManageUseCase,
    AssignRolesManageUseCase,
    RemoveRolesManageUseCase,
  ],
  exports: [UserService],
})
export class UserModule {}
