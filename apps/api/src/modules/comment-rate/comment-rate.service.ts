import { Injectable } from '@nestjs/common';
import { CommentRateRepository } from '@modules/comment-rate/comment-rate.repository';
import { CommentEntity, CommentRateEntity } from '@database/entities';

/**
 * Contém a lógica de negócio para as operações de avaliações de comentários.
 */
@Injectable()
export class CommentRateService {
  constructor(private readonly commentRepository: CommentRateRepository) {}

  /**
   * Cria uma nova avaliação para um comentário.
   *
   * @param {CommentEntity} comment O comentário a ser avaliado.
   * @param {number} clean A avaliação de limpeza.
   * @param {boolean} paper A avaliação de disponibilidade de papel.
   * @param {number} structure A avaliação de estrutura.
   * @param {number} accessibility A avaliação de acessibilidade.
   * @returns {Promise<CommentRateEntity>} A entidade da avaliação criada.
   */
  async createCommentRate(
    comment: CommentEntity,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
  ): Promise<CommentRateEntity> {
    return await this.commentRepository.create(
      comment,
      clean,
      paper,
      structure,
      accessibility,
    );
  }

  /**
   * Atualiza uma avaliação de um comentário.
   *
   * @param {CommentRateEntity} commentRate A entidade da avaliação a ser atualizada.
   * @param {number} [clean] A nova avaliação de limpeza.
   * @param {boolean} [paper] A nova avaliação de disponibilidade de papel.
   * @param {number} [structure] A nova avaliação de estrutura.
   * @param {number} [accessibility] A nova avaliação de acessibilidade.
   * @returns {Promise<CommentRateEntity>} A entidade da avaliação atualizada.
   */
  async updateCommentRate(
    commentRate: CommentRateEntity,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentRateEntity> {
    return await this.commentRepository.update(
      commentRate,
      clean,
      paper,
      structure,
      accessibility,
    );
  }
}
