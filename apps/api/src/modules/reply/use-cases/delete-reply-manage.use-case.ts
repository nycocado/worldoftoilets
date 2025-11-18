import { Injectable, NotFoundException } from '@nestjs/common';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';

/**
 * Caso de Uso para Deletar Resposta (Moderação)
 *
 * @class DeleteReplyManageUseCase
 * @description Implementa a lógica de soft delete de qualquer resposta por moderador.
 * Não valida propriedade - usado por moderadores.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Soft delete da resposta sem verificar autor
 *
 * @example
 * await deleteReplyManageUseCase.execute('reply-public-id', moderatorId);
 * // Marca resposta como deletada (pode ser recuperada antes de expirar)
 *
 * @throws {NotFoundException} Se resposta não existir
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class DeleteReplyManageUseCase {
  /**
   * Construtor do DeleteReplyManageUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de deletar resposta por moderação
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} replyPublicId - Identificador público da resposta
   * @param {string} moderatorPublicId - ID público do moderador
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se resposta não existir
   *
   * @description
   * 1. Busca moderador por publicId
   * 2. Busca resposta por publicId
   * 3. Valida existência da resposta
   * 4. Marca resposta como soft deleted pelo moderador
   * Resposta pode ser recuperada com undelete antes do período de retenção expirar.
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    moderatorPublicId: string,
  ): Promise<void> {
    const moderator =
      await this.userService.getUserByPublicId(moderatorPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    await this.repository.softDelete(reply, moderator);
  }
}
