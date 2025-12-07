import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token';
import { Transactional } from '@mikro-orm/mariadb';
import { createAccessToken } from '@modules/auth/utils';
import { RefreshTokenResponseDto } from '@modules/auth/dto';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants/exceptions.constant';

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
   * @throws {UnauthorizedException} Se o token for inválido, expirado, revogado ou o utilizador foi desativado.
   */
  @Transactional()
  async execute(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (refreshToken.user.deactivatedAt) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.USER_DEACTIVATED);
    }

    const accessToken = await createAccessToken(
      this.jwtService,
      refreshToken.user.publicId,
      refreshToken.user.roles.map((role) => role.apiName),
    );

    return {
      accessToken: accessToken,
      refreshToken: token,
    };
  }
}
