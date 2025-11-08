import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { RefreshTokenResponseDto } from '@modules/auth/dto';
import { createAccessToken } from '@modules/auth/utils/token.utils';

/**
 * Caso de Uso para Renovação de Token
 *
 * @class RefreshTokenUseCase
 * @description Implementa a lógica de renovação de access token via refresh token.
 * Valida refresh token e gera novo access token com os papéis atuais do utilizador.
 *
 * @implements
 *   - Validação de refresh token
 *   - Verificação de expiração
 *   - Geração de novo access token
 *   - Revogação de refresh token antigo
 *   - Criação de novo refresh token
 *
 * @example
 * const response = await refreshTokenUseCase.execute('550e8400-e29b-41d4-a716-446655440000');
 * // Retorna { accessToken, refreshToken }
 *
 * @throws {UnauthorizedException} Se token inválido ou expirado
 */
@Injectable()
export class RefreshTokenUseCase {
  /**
   * Construtor do RefreshTokenUseCase
   *
   * @param {JwtService} jwtService - Serviço NestJS para geração de JWT
   * @param {RefreshTokenService} refreshTokenService - Serviço para refresh tokens
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executar caso de uso de renovação de token
   *
   * @async
   * @param {string} token - Refresh token válido
   * @returns {Promise<RefreshTokenResponseDto>} Novo access token e refresh token
   * @throws {UnauthorizedException} Se token inválido, expirado ou revogado
   *
   * @description
   * 1. Valida refresh token no banco de dados
   * 2. Verifica se não está expirado ou revogado
   * 3. Gera novo access token com papéis atuais do utilizador
   * 4. Cria novo refresh token (para rotação de tokens)
   * 5. Revoga refresh token antigo
   * 6. Retorna novos tokens
   */
  async execute(token: string): Promise<RefreshTokenResponseDto> {
    const refreshToken = await this.refreshTokenService.getByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    if (refreshToken.expiresAt < new Date() || refreshToken.invalidAt) {
      throw new UnauthorizedException('Refresh token expirado.');
    }

    const accessToken = await createAccessToken(
      this.jwtService,
      refreshToken.user.id,
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
