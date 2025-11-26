import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '@modules/refresh-token';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Implementa o caso de uso de logout de uma sessão específica.
 */

@Injectable()
export class LogoutUseCase {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Executa a lógica de logout de uma sessão específica.
   *
   * @param {string} token O refresh token a ser revogado.
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se o refresh token for inválido ou expirado.
   */
  @Transactional()
  async execute(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenService.getByToken(token);
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
  }
}
