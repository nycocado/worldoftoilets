import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';

/**
 * Caso de Uso para Deletar Resposta Própria
 *
 * @class DeleteReplyUseCase
 * @description Implementa a lógica de soft delete de resposta pelo próprio autor.
 * Valida propriedade da resposta antes de permitir exclusão.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Verificação de propriedade (apenas autor pode deletar)
 *   - Soft delete da resposta
 *
 * @example
 * await deleteReplyUseCase.execute('reply-public-id', userId);
 * // Marca resposta como deletada (pode ser recuperada antes de expirar)
 *
 * @throws {NotFoundException} Se resposta não existir
 * @throws {UnauthorizedException} Se utilizador não for o autor da resposta
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class DeleteReplyUseCase {
  /**
   * Construtor do DeleteReplyUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de deletar resposta própria
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} replyPublicId - Identificador público da resposta
   * @param {string} userPublicId - ID público do utilizador (autor)
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se utilizador não for o autor
   *
   * @description
   * 1. Busca utilizador por publicId
   * 2. Busca resposta por publicId
   * 3. Valida existência da resposta
   * 4. Verifica se utilizador é o autor da resposta
   * 5. Marca resposta como soft deleted
   * Resposta pode ser recuperada com undelete antes do período de retenção expirar.
   */
  @Transactional()
  async execute(replyPublicId: string, userPublicId: string): Promise<void> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.user.publicId !== user.publicId) {
      throw new UnauthorizedException(REPLY_EXCEPTIONS.REPLY_NOT_OWNED);
    }

    await this.repository.softDelete(reply, user);
  }
}
