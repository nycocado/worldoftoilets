import { ReplyRepository } from '@modules/reply/reply.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Atualizar Resposta (Moderação)
 *
 * @class UpdateReplyManageUseCase
 * @description Implementa a lógica de atualização de qualquer resposta por moderador.
 * Permite atualizar texto sem verificar propriedade.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Atualização de texto sem verificar autor
 *
 * @example
 * const updated = await updateReplyManageUseCase.execute(
 *   'reply-public-id',
 *   'Novo texto'
 * );
 *
 * @throws {NotFoundException} Se resposta não existir
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class UpdateReplyManageUseCase {
  /**
   * Construtor do UpdateReplyManageUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   */
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Executar caso de uso de atualizar resposta por moderação
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} replyPublicId - Identificador público da resposta
   * @param {string} text - Novo texto da resposta (opcional)
   * @returns {Promise<ReplyResponseDto>} DTO da resposta atualizada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {ConflictException} Se resposta foi deletada
   *
   * @description
   * 1. Busca resposta por publicId
   * 2. Valida existência da resposta
   * 3. Atualiza texto se fornecido
   * 4. Retorna DTO completo da resposta atualizada
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    text?: string,
  ): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    await this.repository.update(reply, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
