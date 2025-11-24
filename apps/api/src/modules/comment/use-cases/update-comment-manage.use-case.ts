import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { CommentRateService } from '@modules/comment-rate';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a atualização de um comentário para fins de moderação.
 */
@Injectable()
export class UpdateCommentManageUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
  ) {}

  /**
   * Atualiza os dados de um comentário para fins de moderação.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @param {string} [text] O novo texto do comentário.
   * @param {number} [clean] A nova avaliação de limpeza.
   * @param {boolean} [paper] A nova avaliação de disponibilidade de papel.
   * @param {number} [structure] A nova avaliação de estrutura.
   * @param {number} [accessibility] A nova avaliação de acessibilidade.
   * @returns {Promise<CommentResponseDto>} O DTO do comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {ConflictException} Se o comentário já foi deletado.
   */
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

    if (comment.isDeleted) {
      throw new ConflictException(COMMENT_EXCEPTIONS.COMMENT_DELETED);
    }

    await this.repository.update(comment, text);

    await this.commentRateService.updateCommentRate(
      comment.rate,
      clean,
      paper,
      structure,
      accessibility,
    );

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
