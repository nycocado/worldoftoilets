import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentEntity, CommentRateEntity } from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';

/**
 * Define a estrutura para a média de avaliações de um sanitário.
 */
export interface ToiletAverageRating {
  avgClean: number;
  avgStructure: number;
  avgAccessibility: number;
  paperAvailability: number;
  totalRatings: number;
}

/**
 * Gerencia o acesso e a persistência de dados para a entidade CommentRateEntity.
 */
@Injectable()
export class CommentRateRepository {
  constructor(
    @InjectRepository(CommentRateEntity)
    private readonly repository: EntityRepository<CommentRateEntity>,
  ) {}

  /**
   * Cria e persiste uma nova avaliação para um comentário.
   * @param {CommentEntity} comment O comentário a ser avaliado.
   * @param {number} clean A avaliação de limpeza.
   * @param {boolean} paper A avaliação de disponibilidade de papel.
   * @param {number} structure A avaliação de estrutura.
   * @param {number} accessibility A avaliação de acessibilidade.
   * @returns {Promise<CommentRateEntity>} A entidade da avaliação criada.
   */
  @Transactional()
  async create(
    comment: CommentEntity,
    clean: number,
    paper: boolean,
    structure: number,
    accessibility: number,
  ): Promise<CommentRateEntity> {
    const em = this.repository.getEntityManager();
    const commentRate = new CommentRateEntity();
    commentRate.comment = comment;
    commentRate.clean = clean;
    commentRate.paper = paper;
    commentRate.structure = structure;
    commentRate.accessibility = accessibility;

    await em.persistAndFlush(commentRate);
    return commentRate;
  }

  /**
   * Atualiza uma avaliação de um comentário.
   * @param {CommentRateEntity} commentRate A entidade da avaliação a ser atualizada.
   * @param {number} [clean] A nova avaliação de limpeza.
   * @param {boolean} [paper] A nova avaliação de disponibilidade de papel.
   * @param {number} [structure] A nova avaliação de estrutura.
   * @param {number} [accessibility] A nova avaliação de acessibilidade.
   * @returns {Promise<CommentRateEntity>} A entidade da avaliação atualizada.
   */
  @Transactional()
  async update(
    commentRate: CommentRateEntity,
    clean?: number,
    paper?: boolean,
    structure?: number,
    accessibility?: number,
  ): Promise<CommentRateEntity> {
    const em = this.repository.getEntityManager();
    if (clean !== undefined) {
      commentRate.clean = clean;
    }
    if (paper !== undefined) {
      commentRate.paper = paper;
    }
    if (structure !== undefined) {
      commentRate.structure = structure;
    }
    if (accessibility !== undefined) {
      commentRate.accessibility = accessibility;
    }
    await em.persistAndFlush(commentRate);
    return commentRate;
  }
}
