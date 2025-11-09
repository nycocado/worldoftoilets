import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { InteractionService } from '@modules/interaction';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  @Transactional()
  async execute(commentPublicId: string, userId: number): Promise<void> {
    const user = await this.userService.getUserById(userId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.user.id !== user.id) {
      throw new UnauthorizedException(COMMENT_EXCEPTIONS.COMMENT_NOT_OWNED);
    }

    await this.repository.softDelete(comment, user);
    await this.interactionService.softDeleteInteraction(
      comment.interaction,
      user,
    );
  }
}
