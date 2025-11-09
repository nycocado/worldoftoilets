import { CommentRepository } from '@modules/comment/comment.repository';
import { EnrichCommentsWithReactsUseCase } from '@modules/comment/use-cases/enrich-comments-with-reacts.use-case';
import { Injectable } from '@nestjs/common';
import { CommentState } from '@database/entities';
import { UserService } from '@modules/user';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class GetCommentsByUserIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly enrichCommentsWithReactsUseCase: EnrichCommentsWithReactsUseCase,
  ) {}

  async execute(
    userId: number,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    const user = await this.userService.getUserById(userId);
    const result = await this.repository.findByUser(
      user,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
    return await this.enrichCommentsWithReactsUseCase.execute(result);
  }
}
