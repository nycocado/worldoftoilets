import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TypeExtraEntity } from '@database/entities';
import { TypeExtraService } from './type-extra.service';
import { TypeExtraRepository } from './type-extra.repository';

@Module({
  imports: [MikroOrmModule.forFeature([TypeExtraEntity])],
  providers: [TypeExtraService, TypeExtraRepository],
  exports: [TypeExtraService],
})
export class TypeExtraModule {}
