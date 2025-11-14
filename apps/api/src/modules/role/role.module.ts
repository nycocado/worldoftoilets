import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RoleService } from './role.service';
import { RoleRepository } from '@modules/role/role.repository';
import { RoleEntity } from '@database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([RoleEntity])],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
