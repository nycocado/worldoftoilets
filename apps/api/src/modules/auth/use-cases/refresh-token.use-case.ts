import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { RefreshTokenResponseDto } from '@modules/auth/dto';
import { createAccessToken } from '@modules/auth/utils/token.utils';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de renovação de token.
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executa a lógica de renovação de token.
   *
   * @param {string} token O refresh token válido.
   * @returns {Promise<RefreshTokenResponseDto>} Novo access token e refresh token.
   * @throws {UnauthorizedException} Se o token for inválido, expirado ou revogado.
   */
  @Transactional()
  async execute(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    const accessToken = await createAccessToken(
      this.jwtService,
      refreshToken.user.publicId,
      refreshToken.user.roles.map((role) => role.apiName),
    );

    const newRefreshToken = await this.refreshTokenService.createRefreshToken(
      refreshToken.user,
    );
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
