import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentEntity, CommentRateEntity } from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';

export interface ToiletAverageRating {
  toiletId: number;
  avgClean: number;
  avgStructure: number;
  avgAccessibility: number;
  paperAvailability: number;
  totalRatings: number;
}

@Injectable()
export class CommentRateRepository {
  constructor(
    @InjectRepository(CommentRateEntity)
    private readonly repository: EntityRepository<CommentRateEntity>,
  ) {}

  async findAverageRatingsByToilet(
    toiletId: number,
  ): Promise<ToiletAverageRating | null> {
    const knex = this.repository.getKnex();

    const result = await knex('comment_rate as cr')
      .select(
        'i.toilet_id as toiletId',
        knex.raw('AVG(cr.clean) as avgClean'),
        knex.raw('AVG(cr.structure) as avgStructure'),
        knex.raw('AVG(cr.accessibility) as avgAccessibility'),
        knex.raw(
          'AVG(CASE WHEN cr.paper = true THEN 1 ELSE 0 END) as paperAvailability',
        ),
        knex.raw('COUNT(*) as totalRatings'),
      )
      .join('comment as c', 'cr.id', 'c.id')
      .join('interaction as i', 'c.interaction_id', 'i.id')
      .where('i.toilet_id', toiletId)
      .groupBy('i.toilet_id')
      .first();

    if (!result) {
      return null;
    }

    return {
      toiletId: result.toiletId,
      avgClean: parseFloat(result.avgClean),
      avgStructure: parseFloat(result.avgStructure),
      avgAccessibility: parseFloat(result.avgAccessibility),
      paperAvailability: parseFloat(result.paperAvailability),
      totalRatings: parseInt(result.totalRatings, 10),
    };
  }

  async findAverageRatingsForToiletsByPublicIds(
    publicIds: string[],
  ): Promise<Map<string, ToiletAverageRating>> {
    if (publicIds.length === 0) {
      return new Map();
    }

    const knex = this.repository.getKnex();

    const results = await knex('comment_rate as cr')
      .select(
        'i.toilet_id as toiletId',
        't.public_id as publicId',
        knex.raw('AVG(cr.clean) as avgClean'),
        knex.raw('AVG(cr.structure) as avgStructure'),
        knex.raw('AVG(cr.accessibility) as avgAccessibility'),
        knex.raw(
          'AVG(CASE WHEN cr.paper = true THEN 1 ELSE 0 END) as paperAvailability',
        ),
        knex.raw('COUNT(*) as totalRatings'),
      )
      .join('comment as c', 'cr.id', 'c.id')
      .join('interaction as i', 'c.interaction_id', 'i.id')
      .join('toilet as t', 'i.toilet_id', 't.id')
      .whereIn('t.public_id', publicIds)
      .groupBy('i.toilet_id', 't.public_id');

    const map = new Map<string, ToiletAverageRating>();
    for (const result of results) {
      map.set(result.publicId, {
        toiletId: result.toiletId,
        avgClean: parseFloat(result.avgClean),
        avgStructure: parseFloat(result.avgStructure),
        avgAccessibility: parseFloat(result.avgAccessibility),
        paperAvailability: parseFloat(result.paperAvailability),
        totalRatings: parseInt(result.totalRatings, 10),
      });
    }
    return map;
  }

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
