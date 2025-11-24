import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para recuperar um comentário que sofreu soft delete.
 */
@Injectable()
export class UndeleteCommentUseCase {
  constructor(private readonly repository: CommentRepository) {}

  /**
   * Recupera um comentário que sofreu soft delete.
   *
   * @param {string} publicId O ID público do comentário.
   * @returns {Promise<CommentResponseDto>} O DTO do comentário recuperado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (!comment.isDeleted) {
      return plainToInstance(CommentResponseDto, comment, {
        excludeExtraneousValues: true,
      });
    }

    await this.repository.undelete(comment);

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
