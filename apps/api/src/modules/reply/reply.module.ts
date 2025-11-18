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
 * Módulo de Respostas
 *
 * @module ReplyModule
 * @description Organiza todos os componentes de gestão de respostas do sistema.
 * Gerir o ciclo de vida completo das respostas a comentários, incluindo:
 * - Criação, edição e exclusão de respostas
 * - Listagem de respostas por comentário ou utilizador
 * - Gestão de estado de respostas (visível/oculto)
 * - Moderação de respostas (hide/show/delete/undelete)
 *
 * @see ReplyController - Controlador com endpoints de respostas
 * @see ReplyService - Serviço para operações de respostas
 * @see ReplyRepository - Repositório para acesso aos dados
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
