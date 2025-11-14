import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { UserService } from '@modules/user';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Comentários por Public ID de Utilizador
 *
 * @class GetCommentsByUserPublicIdUseCase
 * @description Implementa a lógica de busca de comentários de um utilizador específico por publicId.
 * Suporta paginação, filtragem por estado e timestamp.
 *
 * @implements
 *   - Validação de existência do utilizador
 *   - Busca de comentários com paginação
 *   - Filtragem por estado (VISIBLE, HIDDEN, etc)
 *   - Filtragem por timestamp de criação
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const comments = await getCommentsByUserPublicIdUseCase.execute(
 *   'user-public-id',
 *   true, // pageable
 *   0, // page
 *   10, // size
 *   CommentState.VISIBLE,
 *   new Date()
 * );
 *
 * @throws {NotFoundException} Se utilizador não existir
 *
 * @see CommentRepository - Repositório para busca de comentários
 */
@Injectable()
export class GetCommentsByUserPublicIdUseCase {
  /**
   * Construtor do GetCommentsByUserPublicIdUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {UserService} userService - Serviço para operações de utilizador
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Executar caso de uso de obter comentários por publicId de utilizador
   *
   * @async
   * @param {string} userPublicId - Identificador público do utilizador
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {CommentState} commentState - Estado dos comentários a buscar
   * @param {Date} timestamp - Data limite para buscar comentários
   * @returns {Promise<CommentResponseDto[]>} Lista de DTOs de comentários
   * @throws {NotFoundException} Se utilizador não existir
   *
   * @description
   * 1. Busca utilizador por publicId
   * 2. Busca comentários do utilizador com filtros
   * 3. Enriquece comentários com dados de reações
   * 4. Retorna lista de DTOs completos
   * Comentários são ordenados por data de criação descendente.
   */
  async execute(
    userPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const result = await this.repository.findByUser(
      user,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );
    return plainToInstance(CommentResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
