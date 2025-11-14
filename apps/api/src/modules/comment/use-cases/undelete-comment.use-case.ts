import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';
import { EnrichCommentsUseCase } from '@modules/comment/use-cases/enrich-comments.use-case';

/**
 * Caso de Uso para Recuperar Comentário Deletado (Moderação)
 *
 * @class UndeleteCommentUseCase
 * @description Implementa a lógica de recuperar comentário soft-deleted por moderador.
 * Reverte soft delete e restaura estado VISIBLE.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Verificação se foi deletado (idempotência)
 *   - Remoção de marcação de soft delete
 *   - Restauração de estado VISIBLE
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const comment = await undeleteCommentUseCase.execute('comment-public-id');
 * // Recupera comentário soft-deleted
 *
 * @throws {NotFoundException} Se comentário não existir
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see EnrichCommentsUseCase - Enriquece comentário com reações
 */
@Injectable()
export class UndeleteCommentUseCase {
  /**
   * Construtor do UndeleteCommentUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {EnrichCommentsUseCase} enrichCommentsUseCase - Use case para enriquecer com reações
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly enrichCommentsUseCase: EnrichCommentsUseCase,
  ) {}

  /**
   * Executar caso de uso de recuperar comentário deletado
   *
   * @async
   * @param {string} publicId - Identificador público do comentário
   * @returns {Promise<CommentResponseDto>} DTO do comentário recuperado
   * @throws {NotFoundException} Se comentário não existir
   *
   * @description
   * 1. Busca comentário por publicId
   * 2. Valida existência do comentário
   * 3. Se não foi deletado (deletedBy ausente): retorna sem alterar (idempotente)
   * 4. Reverte soft delete: limpa deletedBy, deletedAt e restaura estado VISIBLE
   * 5. Enriquece comentário com dados de reações
   * 6. Retorna DTO completo
   * Apenas funciona para comentários soft-deleted que ainda não expiraram.
   * Usado por moderadores com permissão UNDELETE_COMMENTS.
   */
  async execute(publicId: string): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(publicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    if (!comment.deletedBy) {
      const dto = await this.enrichCommentsUseCase.execute([comment]);
      return dto[0];
    }

    await this.repository.undelete(comment);

    const dto = await this.enrichCommentsUseCase.execute([comment]);
    return dto[0];
  }
}
