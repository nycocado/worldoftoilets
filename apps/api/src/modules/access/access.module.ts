import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AccessEntity } from '@database/entities';
import { AccessRepository } from '@modules/access/access.repository';

@Module({
  imports: [MikroOrmModule.forFeature([AccessEntity])],
  providers: [AccessService, AccessRepository],
  exports: [AccessService],
})
export class AccessModule {}
