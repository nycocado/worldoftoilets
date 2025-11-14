import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

@Injectable()
export class UndeleteCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (!comment.deletedBy) {
      const dto = await this.enrichCommentsUseCase.execute([comment]);
      return dto[0];
    }

    await this.repository.undelete(comment);

    const dto = await this.enrichCommentsUseCase.execute([comment]);
    return dto[0];
  }
}
