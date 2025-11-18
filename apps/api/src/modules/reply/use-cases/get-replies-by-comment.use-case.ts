import { ReplyRepository } from '@modules/reply/reply.repository';
import { Injectable } from '@nestjs/common';
import { ReplyState } from '@database/entities';
import { CommentService } from '@modules/comment';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Obter Respostas por Comentário
 *
 * @class GetRepliesByCommentUseCase
 * @description Implementa a lógica de busca de respostas de um comentário específico.
 * Suporta paginação, filtragem por estado e timestamp.
 *
 * @implements
 *   - Validação de existência do comentário
 *   - Busca de respostas com paginação
 *   - Filtragem por estado (VISIBLE, HIDDEN)
 *   - Filtragem por timestamp de criação
 *
 * @example
 * const replies = await getRepliesByCommentUseCase.execute(
 *   'comment-public-id',
 *   true, // pageable
 *   0, // page
 *   10, // size
 *   ReplyState.VISIBLE,
 *   new Date()
 * );
 *
 * @throws {NotFoundException} Se comentário não existir
 *
 * @see ReplyRepository - Repositório para busca de respostas
 */
@Injectable()
export class GetRepliesByCommentUseCase {
  /**
   * Construtor do GetRepliesByCommentUseCase
   *
   * @param {ReplyRepository} repository - Repositório de respostas
   * @param {CommentService} commentService - Serviço para operações de comentário
   */
  constructor(
    private readonly repository: ReplyRepository,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Executar caso de uso de obter respostas por comentário
   *
   * @async
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {boolean} pageable - Se deve aplicar paginação
   * @param {number} page - Número da página (zero-indexed)
   * @param {number} size - Tamanho da página
   * @param {ReplyState} replyState - Estado das respostas a buscar
   * @param {Date} timestamp - Data limite para buscar respostas
   * @returns {Promise<ReplyResponseDto[]>} Lista de DTOs de respostas
   * @throws {NotFoundException} Se comentário não existir
   *
   * @description
   * 1. Busca comentário por publicId
   * 2. Busca respostas do comentário com filtros
   * 3. Retorna lista de DTOs completos
   * Respostas são ordenadas por data de criação descendente.
   */
  async execute(
    commentPublicId: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    replyState?: ReplyState,
    timestamp?: Date,
  ): Promise<ReplyResponseDto[]> {
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);
    const result = await this.repository.findByComment(
      comment,
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
