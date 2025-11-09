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
  EnrichCommentsWithReactsUseCase,
  GetCommentsByToiletPublicIdUseCase,
  GetCommentsByUserIdUseCase,
  UpdateCommentUseCase,
} from '@modules/comment/use-cases';
import { InteractionModule } from '@modules/interaction/interaction.module';
import { CommentRateModule } from '@modules/comment-rate/comment-rate.module';
import { DeleteExpiredCommentsUseCase } from '@modules/comment/use-cases/delete-expired-comments.use-case';

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
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    DeleteExpiredCommentsUseCase,
    EnrichCommentsWithReactsUseCase,
  ],
  exports: [CommentService],
})
export class CommentModule {}
