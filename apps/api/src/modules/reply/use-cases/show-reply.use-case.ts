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
import { ReplyState } from '@database/entities';

/**
 * Caso de Uso para Mostrar Resposta (Moderação)
 *
 * @class ShowReplyUseCase
 * @description Implementa a lógica de tornar uma resposta visível.
 * Altera estado de HIDDEN para VISIBLE.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Alteração de estado para VISIBLE
 *
 * @example
 * const reply = await showReplyUseCase.execute('reply-public-id');
 *
 * @throws {NotFoundException} Se resposta não existir
 * @throws {ConflictException} Se resposta foi deletada
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class ShowReplyUseCase {
  /**
   * Construtor do ShowReplyUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   */
  constructor(private readonly repository: ReplyRepository) {}

  /**
   * Executar caso de uso de mostrar resposta
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} publicId - Identificador público da resposta
   * @returns {Promise<ReplyResponseDto>} DTO da resposta tornada visível
   * @throws {NotFoundException} Se resposta não existir
   * @throws {ConflictException} Se resposta foi deletada
   *
   * @description
   * 1. Busca resposta por publicId
   * 2. Valida existência da resposta
   * 3. Verifica se resposta não foi deletada
   * 4. Altera estado para VISIBLE
   * 5. Retorna DTO completo da resposta
   */
  @Transactional()
  async execute(publicId: string): Promise<ReplyResponseDto> {
    const reply = await this.repository.findByPublicId(publicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    await this.repository.changeState(reply, ReplyState.VISIBLE);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
