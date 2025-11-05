import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RefreshTokenEntity, UserEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/core';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: EntityRepository<RefreshTokenEntity>,
  ) {}

  async getByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenRepository.findOne(
      { token: token },
      { populate: ['user', 'user.credential', 'user.roles'] },
    );
  }

  async getByUser(user: UserEntity): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.find({ user: user });
  }

  async getExpiredTokens(): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async revokeRefreshToken(refreshToken: RefreshTokenEntity): Promise<void> {
    const em = this.refreshTokenRepository.getEntityManager();
    refreshToken.invalidAt = new Date();
    await em.persistAndFlush(refreshToken);
  }

  async revokeAllUserRefreshTokens(user: UserEntity): Promise<void> {
    const em = this.refreshTokenRepository.getEntityManager();
    const tokens = await this.getByUser(user);

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
  }

  async createRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const em = this.refreshTokenRepository.getEntityManager();

    const refreshTokenExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );

    const expiresInMs = jwtTimeToMilliseconds(refreshTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.expiresAt = expiresAt;

    await em.persistAndFlush(refreshToken);
    return refreshToken;
  }

  async deleteExpiredTokens(): Promise<void> {
    const em = this.refreshTokenRepository.getEntityManager();
    const tokens = await this.getExpiredTokens();
    await em.removeAndFlush(tokens);
  }
}
