import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
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

  async findExpired(): Promise<RefreshTokenEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  @Transactional()
  async create(user: UserEntity, expiresAt: Date): Promise<RefreshTokenEntity> {
    const em = this.repository.getEntityManager();
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.expiresAt = expiresAt;

    await em.persistAndFlush(refreshToken);
    return refreshToken;
  }

  @Transactional()
  async invalidate(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity> {
    const em = this.repository.getEntityManager();
    refreshToken.invalidAt = new Date();
    await em.persistAndFlush(refreshToken);
    return refreshToken;
  }

  @Transactional()
  async invalidateAllByUser(user: UserEntity): Promise<RefreshTokenEntity[]> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({ user: user });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
    return tokens;
  }

  @Transactional()
  async deleteExpired(): Promise<void> {
    const em = this.repository.getEntityManager();
    const tokens = await this.findExpired();
    await em.removeAndFlush(tokens);
  }
}
