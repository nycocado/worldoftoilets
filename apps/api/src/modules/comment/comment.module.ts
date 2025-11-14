import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommentEntity } from '@database/entities/comment.entity';
import { CommentRepository } from '@modules/comment/comment.repository';
import { UserModule } from '@modules/user';
import { ToiletModule } from '@modules/toilet/toilet.module';
import { ReactModule } from '@modules/react/react.module';
import {
  CreateCommentUseCase,
  DeleteCommentUseCase,
  GetCommentsByToiletPublicIdUseCase,
  GetCommentsByUserIdUseCase,
  GetCommentsByUserPublicIdUseCase,
  HideCommentUseCase,
  ShowCommentUseCase,
  UpdateCommentUseCase,
} from '@modules/comment/use-cases';
import { InteractionModule } from '@modules/interaction/interaction.module';
import { CommentRateModule } from '@modules/comment-rate/comment-rate.module';
import { PutReactUseCase } from '@modules/comment/use-cases/put-react.use-case';
import { UpdateCommentManageUseCase } from '@modules/comment/use-cases/update-comment-manage.use-case';
import { DeleteCommentManageUseCase } from '@modules/comment/use-cases/delete-comment-manage.use-case';
import { UndeleteCommentUseCase } from '@modules/comment/use-cases/undelete-comment.use-case';

/**
 * Módulo de Comentários
 *
 * @module CommentModule
 * @description Organiza todos os componentes de gestão de comentários do sistema.
 * Gerir o ciclo de vida completo dos comentários em toilets, incluindo:
 * - Criação, edição e exclusão de comentários
 * - Listagem de comentários por toilet ou utilizador
 * - Sistema de reações (likes/dislikes) em comentários
 * - Gestão de estado de comentários (visível/oculto)
 * - Avaliações (clean, paper, structure, accessibility)
 * - Moderação de comentários (hide/show/delete/undelete)
 *
 * @see CommentController - Controlador com endpoints de comentários
 * @see CommentService - Serviço para operações de comentários
 * @see CommentRepository - Repositório para acesso aos dados
 */
@Module({
  imports: [
    MikroOrmModule.forFeature([CommentEntity]),
    ReactModule,
    ToiletModule,
    UserModule,
    InteractionModule,
    CommentRateModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    GetCommentsByToiletPublicIdUseCase,
    GetCommentsByUserIdUseCase,
    GetCommentsByUserPublicIdUseCase,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    UpdateCommentManageUseCase,
    DeleteCommentUseCase,
    DeleteCommentManageUseCase,
    PutReactUseCase,
    ShowCommentUseCase,
    HideCommentUseCase,
    UndeleteCommentUseCase,
  ],
  exports: [CommentService],
})
export class CommentModule {}
