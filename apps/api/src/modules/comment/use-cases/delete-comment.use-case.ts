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
 * Caso de Uso para Deletar Comentário Próprio
 *
 * @class DeleteCommentUseCase
 * @description Implementa a lógica de soft delete de comentário pelo próprio autor.
 * Valida propriedade do comentário antes de permitir exclusão.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Verificação de propriedade (apenas autor pode deletar)
 *   - Soft delete do comentário e interação associada
 *
 * @example
 * await deleteCommentUseCase.execute('comment-public-id', userId);
 * // Marca comentário como deletado (pode ser recuperado antes de expirar)
 *
 * @throws {NotFoundException} Se comentário não existir
 * @throws {UnauthorizedException} Se utilizador não for o autor do comentário
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see InteractionService - Serviço para soft delete de interação
 */
@Injectable()
export class DeleteCommentUseCase {
  /**
   * Construtor do DeleteCommentUseCase
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
   * Executar caso de uso de deletar comentário próprio
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {number} userId - ID interno do utilizador (autor)
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se utilizador não for o autor
   *
   * @description
   * 1. Busca utilizador por ID interno
   * 2. Busca comentário por publicId
   * 3. Valida existência do comentário
   * 4. Verifica se utilizador é o autor do comentário
   * 5. Marca comentário como soft deleted
   * 6. Marca interação associada como soft deleted
   * Comentário pode ser recuperado com undelete antes do período de retenção expirar.
   */
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
