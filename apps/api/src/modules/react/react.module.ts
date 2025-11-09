import { Module } from '@nestjs/common';
import { ReactService } from './react.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReactEntity } from '@database/entities';
import { ReactRepository } from '@modules/react/react.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ReactEntity])],
  providers: [ReactService, ReactRepository],
  exports: [ReactService],
})
export class ReactModule {}
