import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenEntity, UserEntity } from '@database/entities';
import { RefreshTokenRepository } from '@modules/refresh-token/refresh-token.repository';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';
import { REFRESH_EXCEPTIONS } from '@modules/refresh-token/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para as operações de refresh tokens.
 */
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  /**
   * Busca um refresh token pelo seu valor.
   *
   * @param {string} token O token a ser buscado.
   * @returns {Promise<RefreshTokenEntity>} A entidade do token encontrado.
   * @throws {UnauthorizedException} Se o token for inválido ou expirado.
   */
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

  /**
   * Revoga um refresh token.
   *
   * @param {RefreshTokenEntity} refreshToken A entidade do token a ser revogado.
   * @returns {Promise<RefreshTokenEntity>} A entidade do token revogado.
   */
  async revokeRefreshToken(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.invalidate(refreshToken);
  }

  /**
   * Revoga todos os refresh tokens de um utilizador.
   *
   * @param {UserEntity} user O utilizador.
   * @returns {Promise<RefreshTokenEntity[]>} A lista de entidades de token revogadas.
   */
  async revokeAllUserRefreshTokens(
    user: UserEntity,
  ): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.invalidateAllByUser(user);
  }

  /**
   * Cria um novo refresh token.
   *
   * @param {UserEntity} user O utilizador.
   * @returns {Promise<RefreshTokenEntity>} A entidade do token criado.
   */
  async createRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const refreshTokenExpiration = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const expiresInMs = textTimeToMilliseconds(refreshTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.refreshTokenRepository.create(user, expiresAt);
  }

  /**
   * Remove permanentemente os refresh tokens expirados.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    return this.refreshTokenRepository.deleteExpired();
  }
}
