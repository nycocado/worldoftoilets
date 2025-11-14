import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CommentEntity,
  CommentState,
  InteractionDiscriminator,
  InteractionEntity,
  ToiletEntity,
  UserEntity,
} from '@database/entities';
import {
  EntityRepository,
  QueryOrder,
  Transactional,
} from '@mikro-orm/mariadb';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  async findByPublicId(publicId: string): Promise<CommentEntity | null> {
    return this.commentRepository.findOne(
      { publicId: publicId },
      { populate: ['interaction.user', 'rate'] },
    );
  }

  async findByToilet(
    toilet: ToiletEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentEntity[]> {
    return this.commentRepository.find(
      {
        state: commentState,
        interaction: {
          discriminator: InteractionDiscriminator.COMMENT,
          toilet: toilet,
        },
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['interaction.user.partner', 'rate'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  async findByUser(
    user: UserEntity,
    pageable?: boolean,
    page?: number,
    size?: number,
    commentState?: CommentState,
    timestamp?: Date,
  ): Promise<CommentEntity[]> {
    return this.commentRepository.find(
      {
        state: commentState,
        interaction: {
          discriminator: InteractionDiscriminator.COMMENT,
          user: user,
        },
        createdAt: { $lte: timestamp },
      },
      {
        populate: ['interaction.toilet', 'rate'],
        limit: pageable ? size : undefined,
        offset: pageable && page && size ? page * size : undefined,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  async findExpired(retention: Date): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      deletedAt: {
        $lte: retention,
      },
    });
  }

  async findCommentsCountByUserPublicId(userPublicId: string): Promise<number> {
    const em = this.commentRepository.getEntityManager();
    const knex = em.getKnex();

    const result = await knex('user as u')
      .select(knex.raw('COUNT(c.id) as count'))
      .leftJoin('interaction as i', function () {
        this.on('i.user_id', '=', 'u.id')
          .andOn(knex.raw("i.discriminator = 'comment'"))
          .andOnNull('i.deleted_at');
      })
      .leftJoin('comment as c', function () {
        this.on('c.interaction_id', '=', 'i.id')
          .andOnNull('c.deleted_at')
          .andOn(knex.raw("c.state = 'visible'"));
      })
      .where('u.public_id', userPublicId)
      .first();

    return parseInt(result?.count, 10) || 0;
  }

  async findCommentsCountsByUserPublicIds(
    userPublicIds: string[],
  ): Promise<Map<string, number>> {
    if (userPublicIds.length === 0) {
      return new Map();
    }

    const em = this.commentRepository.getEntityManager();
    const knex = em.getKnex();

    const results = await knex('user as u')
      .select('u.public_id as publicId', knex.raw('COUNT(c.id) as count'))
      .leftJoin('interaction as i', function () {
        this.on('i.user_id', '=', 'u.id')
          .andOn(knex.raw("i.discriminator = 'comment'"))
          .andOnNull('i.deleted_at');
      })
      .leftJoin('comment as c', function () {
        this.on('c.interaction_id', '=', 'i.id')
          .andOnNull('c.deleted_at')
          .andOn(knex.raw("c.state = 'visible'"));
      })
      .whereIn('u.public_id', userPublicIds)
      .groupBy('u.public_id');

    const countsMap = new Map<string, number>();
    for (const result of results) {
      countsMap.set(result.publicId, parseInt(result.count, 10) || 0);
    }

    return countsMap;
  }

  @Transactional()
  async create(
    interaction: InteractionEntity,
    text?: string,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    const comment = new CommentEntity();
    comment.interaction = interaction;
    comment.text = text;
    await em.persistAndFlush(comment);
    return comment;
  }

  @Transactional()
  async softDelete(
    comment: CommentEntity,
    deletedBy: UserEntity,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = CommentState.HIDDEN;
    comment.deletedBy = deletedBy;
    comment.deletedAt = new Date();
    await em.persistAndFlush(comment);
    return comment;
  }

  @Transactional()
  async delete(comment: CommentEntity): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    await em.removeAndFlush(comment);
  }

  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.commentRepository.getEntityManager();
    const comments = await this.findExpired(retention);
    await em.removeAndFlush(comments);
  }

  @Transactional()
  async update(comment: CommentEntity, text?: string): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    if (text !== undefined) {
      comment.text = text;
    }
    await em.persistAndFlush(comment);
    return comment;
  }

  @Transactional()
  async changeState(
    comment: CommentEntity,
    state: CommentState,
  ): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = state;
    await em.persistAndFlush(comment);
    return comment;
  }

  @Transactional()
  async undelete(comment: CommentEntity): Promise<CommentEntity> {
    const em = this.commentRepository.getEntityManager();
    comment.state = CommentState.VISIBLE;
    comment.deletedBy = undefined;
    comment.deletedAt = undefined;
    await em.persistAndFlush(comment);
    return comment;
  }
}
