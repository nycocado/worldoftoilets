import { CommentRepository } from '@modules/comment/comment.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CommentRateService } from '@modules/comment-rate';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a atualização de um comentário pelo seu autor.
 */
@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
    private readonly userService: UserService,
  ) {}

  /**
   * Atualiza os dados de um comentário.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @param {string} publicId O ID público do autor do comentário.
   * @param {string} [text] O novo texto do comentário.
   * @param {number} [clean] A nova avaliação de limpeza.
   * @param {boolean} [paper] A nova avaliação de disponibilidade de papel.
   * @param {number} [structure] A nova avaliação de estrutura.
   * @param {number} [accessibility] A nova avaliação de acessibilidade.
   * @returns {Promise<CommentResponseDto>} O DTO do comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {ConflictException} Se o comentário já foi deletado.
   * @throws {UnauthorizedException} Se o utilizador não for o autor do comentário.
   */
  @Transactional()
  async execute(
    commentPublicId: string,
    publicId: string,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserByPublicId(publicId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment || !comment.rate) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.isDeleted) {
      throw new ConflictException(COMMENT_EXCEPTIONS.COMMENT_DELETED);
    }

    if (comment.user.publicId !== user.publicId) {
      throw new UnauthorizedException(COMMENT_EXCEPTIONS.COMMENT_NOT_OWNED);
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
