import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

/**
 * Caso de Uso para Mostrar Comentário (Moderação)
 *
 * @class ShowCommentUseCase
 * @description Implementa a lógica de tornar comentário visível por moderador.
 * Altera estado de HIDDEN para VISIBLE.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Verificação se já está visível (idempotência)
 *   - Verificação se foi deletado (conflito)
 *   - Alteração de estado para VISIBLE
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const comment = await showCommentUseCase.execute('comment-public-id');
 * // Torna comentário visível publicamente
 *
 * @throws {NotFoundException} Se comentário não existir
 * @throws {ConflictException} Se comentário foi deletado
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see EnrichCommentsUseCase - Enriquece comentário com reações
 */
@Injectable()
export class ShowCommentUseCase {
  /**
   * Construtor do ShowCommentUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {EnrichCommentsUseCase} enrichCommentsUseCase - Use case para enriquecer com reações
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  /**
   * Executar caso de uso de mostrar comentário
   *
   * @async
   * @param {string} publicId - Identificador público do comentário
   * @returns {Promise<CommentResponseDto>} DTO do comentário visível
   * @throws {NotFoundException} Se comentário não existir
   * @throws {ConflictException} Se comentário foi deletado
   *
   * @description
   * 1. Busca comentário por publicId
   * 2. Valida existência do comentário
   * 3. Se já está VISIBLE: retorna sem alterar (idempotente)
   * 4. Se foi deletado (deletedBy presente): lança exceção de conflito
   * 5. Altera estado para VISIBLE
   * 6. Enriquece comentário com dados de reações
   * 7. Retorna DTO completo
   * Usado por moderadores com permissão SHOW_COMMENTS.
   */
  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (comment.state === CommentState.VISIBLE) {
      const dto = await this.enrichCommentsUseCase.execute([comment]);
      return dto[0];
    }

    if (comment.deletedBy) {
      throw new ConflictException(COMMENT_EXCEPTIONS.COMMENT_DELETED);
    }

    await this.repository.changeState(comment, CommentState.VISIBLE);

    const dto = await this.enrichCommentsUseCase.execute([comment]);
    return dto[0];
  }
}
