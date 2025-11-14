import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { CommentRateService } from '@modules/comment-rate';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class UpdateCommentManageUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
    private readonly enrichCommentsWithReactsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(
    commentPublicId: string,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment || !comment.rate) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    await this.repository.update(comment, text);

    await this.commentRateService.updateCommentRate(
      comment.rate,
      clean,
      paper,
      structure,
      accessibility,
    );

    const dto = await this.enrichCommentsWithReactsUseCase.execute([comment]);

    return dto[0];
  }
}
