import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { InteractionService } from '@modules/interaction';

/**
 * Contém a lógica de negócio para o soft delete de um comentário para fins de moderação.
 */
@Injectable()
export class DeleteCommentManageUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  /**
   * Realiza o soft delete de um comentário para fins de moderação.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @param {string} publicId O ID público do moderador que está a realizar a exclusão.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @Transactional()
  async execute(commentPublicId: string, publicId: string): Promise<void> {
    const user = await this.userService.getUserByPublicId(publicId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    await this.repository.softDelete(comment, user);
    await this.interactionService.softDeleteInteraction(
      comment.interaction,
      user,
    );
  }
}
