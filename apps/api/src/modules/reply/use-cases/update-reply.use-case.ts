import { ReplyRepository } from '@modules/reply/reply.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { UserService } from '@modules/user';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Atualizar Resposta Própria
 *
 * @class UpdateReplyUseCase
 * @description Implementa a lógica de atualização de resposta pelo próprio autor.
 * Permite atualizar texto da resposta.
 *
 * @implements
 *   - Validação de existência da resposta
 *   - Verificação de propriedade (apenas autor pode editar)
 *   - Atualização de texto
 *
 * @example
 * const updated = await updateReplyUseCase.execute(
 *   'reply-public-id',
 *   userId,
 *   'Novo texto'
 * );
 *
 * @throws {NotFoundException} Se resposta não existir
 * @throws {UnauthorizedException} Se utilizador não for o autor da resposta
 *
 * @see ReplyRepository - Repositório para operações de resposta
 */
@Injectable()
export class UpdateReplyUseCase {
  /**
   * Construtor do UpdateReplyUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de atualizar resposta própria
   *
   * @async
   * @transactional Executa dentro de transação
   * @param {string} replyPublicId - Identificador público da resposta
   * @param {string} userPublicId - ID público do utilizador (autor)
   * @param {string} text - Novo texto da resposta (opcional)
   * @returns {Promise<ReplyResponseDto>} DTO da resposta atualizada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se utilizador não for o autor
   * @throws {ConflictException} Se resposta foi deletada
   *
   * @description
   * 1. Busca utilizador por publicId
   * 2. Busca resposta por publicId
   * 3. Valida existência da resposta
   * 4. Verifica se utilizador é o autor da resposta
   * 5. Atualiza texto se fornecido
   * 6. Retorna DTO completo da resposta atualizada
   */
  @Transactional()
  async execute(
    replyPublicId: string,
    userPublicId: string,
    text?: string,
  ): Promise<ReplyResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const reply = await this.repository.findByPublicId(replyPublicId);

    if (!reply) {
      throw new NotFoundException(REPLY_EXCEPTIONS.REPLY_NOT_FOUND);
    }

    if (reply.deletedAt) {
      throw new ConflictException(REPLY_EXCEPTIONS.REPLY_DELETED);
    }

    if (reply.user.publicId !== user.publicId) {
      throw new UnauthorizedException(REPLY_EXCEPTIONS.REPLY_NOT_OWNED);
    }

    await this.repository.update(reply, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
