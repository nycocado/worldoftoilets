import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentState } from '@database/entities';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class GetCommentsByToiletPublicIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly toiletService: ToiletService,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(
    publicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    const toilet = await this.toiletService.getToiletByPublicId(publicId);
    const result = await this.repository.findByToilet(
      toilet,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
    return await this.enrichCommentsUseCase.execute(result);
  }
}
