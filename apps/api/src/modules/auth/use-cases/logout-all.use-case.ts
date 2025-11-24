import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de logout de todas as sessões do utilizador.
 */
@Injectable()
export class LogoutAllUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executa a lógica de logout de todas as sessões do utilizador.
   *
   * @param {string} token O refresh token para identificar o utilizador.
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se o refresh token for inválido ou expirado.
   */
  @Transactional()
  async execute(token: string): Promise<void> {
    const user = await this.userService.getUserByRefreshToken(token);
    await this.refreshTokenService.revokeAllUserRefreshTokens(user);
  }
}
