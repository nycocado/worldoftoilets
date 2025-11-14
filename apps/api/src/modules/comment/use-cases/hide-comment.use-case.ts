import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

@Injectable()
export class HideCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.state === CommentState.HIDDEN) {
      const dto = await this.enrichCommentsUseCase.execute([comment]);
      return dto[0];
    }

    if (comment.deletedBy) {
      throw new ConflictException(COMMENT_EXCEPTIONS.COMMENT_DELETED);
    }

    await this.repository.changeState(comment, CommentState.HIDDEN);

    const dto = await this.enrichCommentsUseCase.execute([comment]);
    return dto[0];
  }
}
