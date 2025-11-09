import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReplyEntity } from '@database/entities';
import { ReplyRepository } from '@modules/reply/reply.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ReplyEntity])],
  controllers: [ReplyController],
  providers: [ReplyService, ReplyRepository],
  exports: [ReplyService],
})
export class ReplyModule {}
