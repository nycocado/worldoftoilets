import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { RefreshTokenEntity, UserEntity } from '@database/entities';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: EntityRepository<RefreshTokenEntity>,
  ) {}

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['user', 'user.credential', 'user.roles'] },
    );
  }

  async findByUser(user: UserEntity): Promise<RefreshTokenEntity[]> {
    return this.repository.find({ user: user });
  }

  async findExpired(): Promise<RefreshTokenEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async create(user: UserEntity, expiresAt: Date): Promise<RefreshTokenEntity> {
    const em = this.getEntityManager();
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.expiresAt = expiresAt;

    await em.persistAndFlush(refreshToken);
    return refreshToken;
  }

  async invalidate(refreshToken: RefreshTokenEntity): Promise<void> {
    const em = this.getEntityManager();
    refreshToken.invalidAt = new Date();
    await em.persistAndFlush(refreshToken);
  }

  async invalidateAllByUser(user: UserEntity): Promise<void> {
    const em = this.getEntityManager();
    const tokens = await this.repository.find({ user: user });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
  }

  async deleteExpired(): Promise<void> {
    const em = this.getEntityManager();
    const tokens = await this.repository.find({
      expiresAt: { $lt: new Date() },
    });
    await em.removeAndFlush(tokens);
  }

  private getEntityManager(): EntityManager {
    return this.repository.getEntityManager();
  }
}
