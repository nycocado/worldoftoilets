import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommentState } from '@database/entities/comment.entity';
import { CommentResponseDto } from '@modules/comment/dto/comment-response.dto';
import {
  GetCommentsByToiletPublicIdUseCase,
  GetCommentsByUserIdUseCase,
} from '@modules/comment/use-cases';
import { CreateCommentUseCase } from '@modules/comment/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from '@modules/comment/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '@modules/comment/use-cases/delete-comment.use-case';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { DeleteExpiredCommentsUseCase } from '@modules/comment/use-cases/delete-expired-comments.use-case';
import { ReactDiscriminator } from '@database/entities';
import { PutReactUseCase } from '@modules/comment/use-cases/put-react.use-case';

@Injectable()
export class CommentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly getCommentsByToiletPublicIdUseCase: GetCommentsByToiletPublicIdUseCase,
    private readonly getCommentsByUserIdUseCase: GetCommentsByUserIdUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly deleteExpiredCommentsUseCase: DeleteExpiredCommentsUseCase,
    private readonly putReactUseCase: PutReactUseCase,
  ) {}

  async getCommentsByToiletPublicId(
    publicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    return this.getCommentsByToiletPublicIdUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
  }

  async getCommentByUser(
    userId: number,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    return this.getCommentsByUserIdUseCase.execute(
      userId,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
  }

  async createComment(
    userId: number,
    toiletPublicId: string,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
    text?: string,
  ): Promise<CommentResponseDto> {
    return this.createCommentUseCase.execute(
      userId,
      toiletPublicId,
      clean,
      paper,
      structure,
      accessibility,
      text,
    );
  }

  async softDeleteComment(publicId: string, userId: number): Promise<void> {
    return this.deleteCommentUseCase.execute(publicId, userId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredComments(): Promise<void> {
    const commentRetention = this.configService.getOrThrow<string>(
      'COMMENT_SOFT_DELETE_RETENTION',
    );
    const retentionMs = textTimeToMilliseconds(commentRetention);
    const retention = new Date(Date.now() - retentionMs);
    return this.deleteExpiredCommentsUseCase.execute(retention);
  }

  async updateComment(
    publicId: string,
    userId: number,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    return this.updateCommentUseCase.execute(
      publicId,
      userId,
      text,
      clean,
      paper,
      structure,
      accessibility,
    );
  }

  async reactToComment(
    userId: number,
    commentPublicId: string,
    discriminator: ReactDiscriminator,
  ): Promise<CommentResponseDto> {
    return this.putReactUseCase.execute(userId, commentPublicId, discriminator);
  }
}
