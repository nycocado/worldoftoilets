import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

/**
 * Caso de Uso para Logout de Sessão Específica
 *
 * @class LogoutUseCase
 * @description Implementa a lógica de logout de uma sessão específica.
 * Revoga o refresh token correspondente.
 *
 * @implements
 *   - Validação de refresh token
 *   - Revogação de token
 *
 * @example
 * await logoutUseCase.execute('550e8400-e29b-41d4-a716-446655440000');
 * // Logout de sessão específica
 *
 * @throws {UnauthorizedException} Se refresh token inválido
 */

@Injectable()
export class LogoutUseCase {
  /**
   * Construtor do LogoutUseCase
   *
   * @param {RefreshTokenService} refreshTokenService - Serviço para refresh tokens
   */
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Executar caso de uso de logout de sessão específica
   *
   * @async
   * @param {string} token - Refresh token a revogar
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se refresh token inválido ou expirado
   *
   * @description
   * 1. Valida refresh token
   * 2. Marca token como inválido/revogado
   * 3. Efetua logout de uma sessão específica
   * 4. Outras sessões do utilizador permanecem ativas
   */
  async execute(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.REFRESH_TOKEN_INVALID);
    }

    await this.refreshTokenService.revokeRefreshToken(refreshToken);
  }
}
