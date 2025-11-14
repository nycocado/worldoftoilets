import { Injectable } from '@nestjs/common';
import { CommentRepository } from '@modules/comment/comment.repository';
import { ToiletService } from '@modules/toilet/toilet.service';
import { CommentState } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Comentários por Toilet
 *
 * @class GetCommentsByToiletPublicIdUseCase
 * @description Implementa a lógica de busca de comentários de um toilet específico.
 * Suporta paginação, filtragem por estado e timestamp.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Busca de comentários com paginação
 *   - Filtragem por estado (VISIBLE, HIDDEN, etc)
 *   - Filtragem por timestamp de criação
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const comments = await getCommentsByToiletPublicIdUseCase.execute(
 *   'toilet-public-id',
 *   true, // pageable
 *   0, // page
 *   10, // size
 *   CommentState.VISIBLE,
 *   new Date()
 * );
 *
 * @throws {NotFoundException} Se toilet não existir
 *
 * @see CommentRepository - Repositório para busca de comentários
 */
@Injectable()
export class GetCommentsByToiletPublicIdUseCase {
  /**
   * Construtor do GetCommentsByToiletPublicIdUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {ToiletService} toiletService - Serviço para operações de toilet
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Executar caso de uso de obter comentários por toilet
   *
   * @async
   * @param {string} publicId - Identificador público do toilet
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {CommentState} commentState - Estado dos comentários a buscar
   * @param {Date} timestamp - Data limite para buscar comentários
   * @returns {Promise<CommentResponseDto[]>} Lista de DTOs de comentários
   * @throws {NotFoundException} Se toilet não existir
   *
   * @description
   * 1. Busca toilet por publicId
   * 2. Busca comentários do toilet com filtros
   * 3. Enriquece comentários com dados de reações do utilizador atual
   * 4. Retorna lista de DTOs completos
   * Comentários são ordenados por data de criação descendente.
   */
  async execute(
    publicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentResponseDto[]> {
    const toilet = await this.toiletService.getToiletByPublicId(publicId);
    const result = await this.repository.findByToilet(
      toilet,
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
