import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity, UserEntity } from '@database/entities';
import { RefreshTokenRepository } from '@modules/refresh-token/refresh-token.repository';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async getByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenRepository.findByToken(token);
  }

  async getByUser(user: UserEntity): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.findByUser(user);
  }

  async getExpiredTokens(): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.findExpired();
  }

  async revokeRefreshToken(refreshToken: RefreshTokenEntity): Promise<void> {
    return this.refreshTokenRepository.invalidate(refreshToken);
  }

  async revokeAllUserRefreshTokens(user: UserEntity): Promise<void> {
    return this.refreshTokenRepository.invalidateAllByUser(user);
  }

  async createRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const refreshTokenExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const expiresInMs = jwtTimeToMilliseconds(refreshTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.refreshTokenRepository.create(user, expiresAt);
  }

  async deleteExpiredTokens(): Promise<void> {
    return this.refreshTokenRepository.deleteExpired();
  }
}
