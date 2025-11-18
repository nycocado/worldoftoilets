import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable } from '@nestjs/common';
import { ReplyState } from '@database/entities';
import { UserService } from '@modules/user';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Respostas por Utilizador
 *
 * @class GetRepliesByUserUseCase
 * @description Implementa a lógica de busca de respostas de um utilizador específico.
 * Suporta paginação, filtragem por estado e timestamp.
 *
 * @implements
 *   - Validação de existência do utilizador
 *   - Busca de respostas com paginação
 *   - Filtragem por estado (VISIBLE, HIDDEN)
 *   - Filtragem por timestamp de criação
 *
 * @example
 * const replies = await getRepliesByUserUseCase.execute(
 *   'user-public-id',
 *   true, // pageable
 *   0, // page
 *   10, // size
 *   ReplyState.VISIBLE,
 *   new Date()
 * );
 *
 * @throws {NotFoundException} Se utilizador não existir
 *
 * @see ReplyRepository - Repositório para busca de respostas
 */
@Injectable()
export class GetRepliesByUserUseCase {
  /**
   * Construtor do GetRepliesByUserUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de obter respostas por utilizador
   *
   * @async
   * @param {string} userPublicId - ID público do utilizador
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {ReplyState} replyState - Estado das respostas a buscar
   * @param {Date} timestamp - Data limite para buscar respostas
   * @returns {Promise<ReplyResponseDto[]>} Lista de DTOs de respostas
   * @throws {NotFoundException} Se utilizador não existir
   *
   * @description
   * 1. Busca utilizador por publicId
   * 2. Busca respostas do utilizador com filtros
   * 3. Retorna lista de DTOs completos
   * Respostas são ordenadas por data de criação descendente.
   */
  async execute(
    userPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyResponseDto[]> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const result = await this.repository.findByUser(
      user,
      pageable,
      page,
      size,
      replyState,
      timestamp,
    );
    return plainToInstance(ReplyResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
