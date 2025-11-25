import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReplyEntity } from '@database/entities/reply.entity';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { UserModule } from '@modules/user';
import { CommentModule } from '@modules/comment/comment.module';
import {
  CreateReplyUseCase,
  DeleteReplyUseCase,
  DeleteReplyManageUseCase,
  GetRepliesByCommentUseCase,
  GetRepliesByUserUseCase,
  HideReplyUseCase,
  ShowReplyUseCase,
  UpdateReplyUseCase,
  UpdateReplyManageUseCase,
  UndeleteReplyUseCase,
} from '@modules/reply/use-cases';

/**
 * Gerencia a funcionalidade de respostas, agrupando seus componentes.
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([ReplyEntity]),
    UserModule,
    CommentModule,
  ],
  controllers: [ReplyController],
  providers: [
    ReplyService,
    ReplyRepository,
    CreateReplyUseCase,
    UpdateReplyUseCase,
    UpdateReplyManageUseCase,
    DeleteReplyUseCase,
    DeleteReplyManageUseCase,
    GetRepliesByCommentUseCase,
    GetRepliesByUserUseCase,
    ShowReplyUseCase,
    HideReplyUseCase,
    UndeleteReplyUseCase,
  ],
  exports: [ReplyService],
})
export class ReplyModule {}
