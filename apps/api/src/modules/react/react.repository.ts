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
