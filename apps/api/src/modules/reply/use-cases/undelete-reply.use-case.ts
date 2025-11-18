import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Recuperar Resposta Deletada (Moderação)
 *
 * @class UndeleteReplyUseCase
 * @description Implementa a lógica de recuperar uma resposta soft-deleted.
 * Reverte soft delete e restaura estado VISIBLE.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Reversão do soft delete
 *   - Restauração do estado VISIBLE
 *
 * @example
 * const reply = await undeleteReplyUseCase.execute('reply-public-id');
 *
 * @throws {NotFoundException} Se resposta não existir
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class UndeleteReplyUseCase {
  /**
   * Construtor do UndeleteReplyUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   */
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Executar caso de uso de recuperar resposta deletada
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} publicId - Identificador público da resposta
   * @returns {Promise<ReplyResponseDto>} DTO da resposta recuperada
   * @throws {NotFoundException} Se resposta não existir
   *
   * @description
   * 1. Busca resposta por publicId
   * 2. Valida existência da resposta
   * 3. Reverte soft delete (limpa deletedBy e deletedAt)
   * 4. Restaura estado para VISIBLE
   * 5. Retorna DTO completo da resposta
   */
  @Transactional()
  async execute(publicId: string): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(publicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    await this.repository.undelete(reply);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
