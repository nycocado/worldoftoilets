import { Module } from '@nestjs/common';
import { ToiletService } from './toilet.service';
import { ToiletController } from './toilet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ToiletEntity } from '@database/entities';
import { ToiletRepository } from '@modules/toilet/toilet.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ToiletEntity])],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository],
  exports: [ToiletService],
})
export class ToiletModule {}
