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
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

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
}
