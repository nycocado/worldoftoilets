import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  ReactDiscriminator,
  ReactEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityManager,
  EntityRepository,
  Transactional,
} from '@mikro-orm/mariadb';

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

  async findByUserAndComment(
    userId: number,
    commentId: number,
  ): Promise<ReactEntity | null> {
    return this.repository.findOne({
      user: { id: userId },
      comment: { id: commentId },
    });
  }

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

  @Transactional()
  async create(
    user: UserEntity,
    comment: CommentEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    const em = this.repository.getEntityManager();
    const react = new ReactEntity();
    react.user = user;
    react.comment = comment;
    react.discriminator = discriminator;
    await em.persistAndFlush(react);
    return react;
  }

  @Transactional()
  async update(
    react: ReactEntity,
    discriminator: ReactDiscriminator,
  ): Promise<ReactEntity> {
    const em = this.repository.getEntityManager();
    react.discriminator = discriminator;
    await em.persistAndFlush(react);
    return react;
  }

  @Transactional()
  async delete(react: ReactEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(react);
  }
}
