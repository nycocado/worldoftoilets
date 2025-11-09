import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';
import { Transactional } from '@mikro-orm/mariadb';

/**
 * Caso de Uso para Logout Global
 *
 * @class LogoutAllUseCase
 * @description Implementa a lógica de logout de todas as sessões do utilizador.
 * Revoga todos os refresh tokens do utilizador.
 *
 * @implements
 *   - Validação de refresh token para identificar utilizador
 *   - Revogação de TODOS os refresh tokens do utilizador
 *
 * @example
 * await logoutAllUseCase.execute('550e8400-e29b-41d4-a716-446655440000');
 * // Logout global - todas as sessões são terminadas
 *
 * @throws {UnauthorizedException} Se refresh token inválido
 */
@Injectable()
export class LogoutAllUseCase {
  /**
   * Construtor do LogoutAllUseCase
   *
   * @param {UserService} userService - Serviço para operações de utilizador
   * @param {RefreshTokenService} refreshTokenService - Serviço para refresh tokens
   */
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executar caso de uso de logout global
   *
   * @async
   * @param {string} token - Refresh token para identificar utilizador
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} Se refresh token inválido ou expirado
   *
   * @description
   * 1. Identifica utilizador a partir do refresh token
   * 2. Valida token
   * 3. Revoga TODOS os refresh tokens do utilizador
   * 4. Todas as sessões abertas são terminadas
   * 5. Utilizador precisa de fazer novo login
   */
  @Transactional()
  async execute(token: string): Promise<void> {
    const user = await this.userService.getUserByRefreshToken(token);
    await this.refreshTokenService.revokeAllUserRefreshTokens(user);
  }
}
