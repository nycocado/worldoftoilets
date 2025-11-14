import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { UserService } from '@modules/user';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';

@Injectable()
export class GetCommentsByUserPublicIdUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  async execute(
    userPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const result = await this.repository.findByUser(
      user,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
    return await this.enrichCommentsUseCase.execute(result);
  }
}
