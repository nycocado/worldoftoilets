import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ReactEntity } from '@database/entities';
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb';

export interface CommentReactionCount {
  commentId: number;
  publicId: string;
  likes: number;
  dislikes: number;
}

@Injectable()
export class ReactRepository {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly repository: EntityRepository<ReactEntity>,
    private readonly em: EntityManager,
  ) {}

  async findReactCountsByComment(
    commentId: number,
  ): Promise<CommentReactionCount | null> {
    const knex = this.em.getKnex();

    const result = await knex('react as r')
      .select(
        'r.comment_id as commentId',
        'c.public_id as publicId',
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'like' THEN 1 ELSE 0 END) as likes",
        ),
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'dislike' THEN 1 ELSE 0 END) as dislikes",
        ),
      )
      .join('comment as c', 'r.comment_id', 'c.id')
      .where('r.comment_id', commentId)
      .groupBy('r.comment_id', 'c.public_id')
      .first();

    if (!result) {
      return null;
    }

    return {
      commentId: result.commentId,
      publicId: result.publicId,
      likes: parseInt(result.likes, 10) || 0,
      dislikes: parseInt(result.dislikes, 10) || 0,
    };
  }

  async findReactionCountsForCommentsByIds(
    commentIds: number[],
  ): Promise<Map<number, CommentReactionCount>> {
    if (commentIds.length === 0) {
      return new Map();
    }

    const knex = this.em.getKnex();

    const results = await knex('react as r')
      .select(
        'r.comment_id as commentId',
        'c.public_id as publicId',
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'like' THEN 1 ELSE 0 END) as likes",
        ),
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'dislike' THEN 1 ELSE 0 END) as dislikes",
        ),
      )
      .join('comment as c', 'r.comment_id', 'c.id')
      .whereIn('r.comment_id', commentIds)
      .groupBy('r.comment_id', 'c.public_id');

    const map = new Map<number, CommentReactionCount>();
    for (const result of results) {
      map.set(result.commentId, {
        commentId: result.commentId,
        publicId: result.publicId,
        likes: parseInt(result.likes, 10) || 0,
        dislikes: parseInt(result.dislikes, 10) || 0,
      });
    }
    return map;
  }

  async findReactionCountsForCommentsByPublicIds(
    publicIds: string[],
  ): Promise<Map<string, CommentReactionCount>> {
    if (publicIds.length === 0) {
      return new Map();
    }

    const knex = this.em.getKnex();

    const results = await knex('react as r')
      .select(
        'r.comment_id as commentId',
        'c.public_id as publicId',
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'like' THEN 1 ELSE 0 END) as likes",
        ),
        knex.raw(
          "SUM(CASE WHEN r.discriminator = 'dislike' THEN 1 ELSE 0 END) as dislikes",
        ),
      )
      .join('comment as c', 'r.comment_id', 'c.id')
      .whereIn('c.public_id', publicIds)
      .groupBy('r.comment_id', 'c.public_id');

    const map = new Map<string, CommentReactionCount>();
    for (const result of results) {
      map.set(result.publicId, {
        commentId: result.commentId,
        publicId: result.publicId,
        likes: parseInt(result.likes, 10) || 0,
        dislikes: parseInt(result.dislikes, 10) || 0,
      });
    }
    return map;
  }
}
