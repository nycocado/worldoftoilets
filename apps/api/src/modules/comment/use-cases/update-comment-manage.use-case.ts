import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@modules/comment';
import { CommentRateService } from '@modules/comment-rate';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants';
import { CommentResponseDto } from '@modules/comment/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Caso de Uso para Atualizar Comentário (Gestão/Moderação)
 *
 * @class UpdateCommentManageUseCase
 * @description Implementa a lógica de atualização de qualquer comentário por moderador.
 * Diferente do UpdateCommentUseCase, não verifica propriedade - usado para moderação.
 *
 * @implements
 *   - Validação de existência do comentário e avaliação
 *   - Atualização de texto sem verificação de propriedade
 *   - Atualização de avaliação sem verificação de propriedade
 *   - Enriquecimento com dados de reações
 *
 * @example
 * const updated = await updateCommentManageUseCase.execute(
 *   'comment-public-id',
 *   'Texto moderado',
 *   5, // clean
 *   true, // paper
 *   4, // structure
 *   3 // accessibility
 * );
 *
 * @throws {NotFoundException} Se comentário ou avaliação não existir
 *
 * @see CommentRepository - Repositório para operações de comentário
 * @see CommentRateService - Serviço para atualização de avaliação
 */
@Injectable()
export class UpdateCommentManageUseCase {
  /**
   * Construtor do UpdateCommentManageUseCase
   *
   * @param {CommentRepository} repository - Repositório de comentários
   * @param {CommentRateService} commentRateService - Serviço para operações de avaliação
   */
  constructor(
    private readonly repository: CommentRepository,
    private readonly commentRateService: CommentRateService,
  ) {}

  /**
   * Executar caso de uso de atualizar comentário (moderação)
   *
   * @async
   * @param {string} commentPublicId - Identificador público do comentário
   * @param {string} text - Novo texto do comentário (opcional)
   * @param {number} clean - Nova avaliação de limpeza (opcional)
   * @param {boolean} paper - Nova disponibilidade de papel (opcional)
   * @param {number} structure - Nova avaliação de estrutura (opcional)
   * @param {number} accessibility - Nova avaliação de acessibilidade (opcional)
   * @returns {Promise<CommentResponseDto>} DTO do comentário atualizado
   * @throws {NotFoundException} Se comentário ou avaliação não existir
   *
   * @description
   * 1. Busca comentário e avaliação por publicId
   * 2. Valida existência do comentário e avaliação
   * 3. Atualiza texto se fornecido
   * 4. Atualiza avaliação se fornecida
   * 5. Enriquece comentário com dados de reações
   * 6. Retorna DTO completo do comentário atualizado
   * Não valida propriedade - pode editar qualquer comentário.
   * Usado por moderadores com permissão EDIT_COMMENTS.
   */
  async execute(
    commentPublicId: string,
    text?: string,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentResponseDto> {
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment || !comment.rate) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    await this.repository.update(comment, text);

    await this.commentRateService.updateCommentRate(
      comment.rate,
      clean,
      paper,
      structure,
      accessibility,
    );

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
