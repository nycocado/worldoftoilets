import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para ocultar um comentário para fins de moderação.
 */
@Injectable()
export class HideCommentUseCase {
  constructor(private readonly repository: CommentRepository) {}

  /**
   * Oculta um comentário.
   *
   * @param {string} publicId O ID público do comentário.
   * @returns {Promise<CommentResponseDto>} O DTO do comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {ConflictException} Se o comentário já foi deletado.
   */
  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.state === CommentState.HIDDEN) {
      return plainToInstance(CommentResponseDto, comment, {
        excludeExtraneousValues: true,
      });
    }

    if (comment.isDeleted) {
      throw new ConflictException(COMMENT_EXCEPTIONS.COMMENT_DELETED);
    }

    await this.repository.changeState(comment, CommentState.HIDDEN);

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
