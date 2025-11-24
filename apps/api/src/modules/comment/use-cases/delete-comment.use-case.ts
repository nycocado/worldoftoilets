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

/**
 * Contém a lógica de negócio para o soft delete de um comentário pelo seu autor.
 */
@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  /**
   * Realiza o soft delete de um comentário, verificando a autoria.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @param {string} publicId O ID público do autor do comentário.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {UnauthorizedException} Se o utilizador não for o autor do comentário.
   */
  @Transactional()
  async execute(commentPublicId: string, publicId: string): Promise<void> {
    const user = await this.userService.getUserByPublicId(publicId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.user.publicId !== user.publicId) {
      throw new UnauthorizedException(COMMENT_EXCEPTIONS.COMMENT_NOT_OWNED);
    }

    await this.repository.softDelete(comment, user);
    await this.interactionService.softDeleteInteraction(
      comment.interaction,
      user,
    );
  }
}
