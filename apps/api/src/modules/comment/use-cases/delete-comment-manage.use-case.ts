import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { InteractionService } from '@modules/interaction';

/**
 * Caso de Uso para Deletar Comentário (Gestão/Moderação)
 *
 * @class DeleteCommentManageUseCase
 * @description Implementa a lógica de soft delete de qualquer comentário por moderador.
 * Diferente do DeleteCommentUseCase, não verifica propriedade - usado para moderação.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Soft delete sem verificação de propriedade
 *   - Marcação de quem executou a moderação
 *
 * @example
 * await deleteCommentManageUseCase.execute('comment-public-id', moderatorUserId);
 * // Marca comentário como deletado (independente de quem é o autor)
 *
 * @throws {NotFoundException} Se comentário não existir
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see InteractionService - Serviço para soft delete de interação
 */
@Injectable()
export class DeleteCommentManageUseCase {
  /**
   * Construtor do DeleteCommentManageUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {InteractionService} interactionService - Serviço para operações de interação
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly interactionService: InteractionService,
  ) {}

  /**
   * Executar caso de uso de deletar comentário (moderação)
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {number} userId - ID interno do moderador
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se comentário não existir
   *
   * @description
   * 1. Busca utilizador moderador por ID interno
   * 2. Busca comentário por publicId
   * 3. Valida existência do comentário
   * 4. Marca comentário como soft deleted (registra moderador que deletou)
   * 5. Marca interação associada como soft deleted
   * Não valida propriedade - pode deletar qualquer comentário.
   * Usado por moderadores com permissão DELETE_COMMENTS.
   */
  @Transactional()
  async execute(commentPublicId: string, userId: number): Promise<void> {
    const user = await this.userService.getUserById(userId);
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
