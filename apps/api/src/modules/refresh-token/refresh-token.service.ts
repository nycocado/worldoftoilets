import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenEntity, UserEntity } from '@database/entities';
import { RefreshTokenRepository } from '@modules/refresh-token/refresh-token.repository';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { REFRESH_EXCEPTIONS } from '@modules/refresh-token/constants/exceptions.constant';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async getByToken(token: string): Promise<RefreshTokenEntity> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException(REFRESH_EXCEPTIONS.REFRESH_TOKEN_INVALID);
    }

    if (refreshToken.isExpired) {
      throw new UnauthorizedException(REFRESH_EXCEPTIONS.REFRESH_TOKEN_EXPIRED);
    }

    return refreshToken;
  }
  async revokeRefreshToken(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.invalidate(refreshToken);
  }

  async revokeAllUserRefreshTokens(
    user: UserEntity,
  ): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.invalidateAllByUser(user);
  }

  async createRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const refreshTokenExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const expiresInMs = textTimeToMilliseconds(refreshTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.refreshTokenRepository.create(user, expiresAt);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    return this.refreshTokenRepository.deleteExpired();
  }
}
