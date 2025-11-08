import { Injectable } from '@nestjs/common';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';

/**
 * Caso de Uso para Reset de Password
 *
 * @class ResetPasswordUseCase
 * @description Implementa a lógica de reset de password.
 * Valida token, altera password e revoga todos os tokens.
 *
 * @implements
 *   - Validação de token de reset
 *   - Atualização de password
 *   - Revogação de todos os tokens de reset
 *   - Revogação de todas as sessões (refresh tokens)
 *
 * @example
 * await resetPasswordUseCase.execute(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   'newPassword123'
 * );
 * // Altera password e termina todas as sessões
 *
 * @throws {BadRequestException} Se token inválido ou expirado
 */
@Injectable()
export class ResetPasswordUseCase {
  /**
   * Construtor do ResetPasswordUseCase
   *
   * @param {UserCredentialService} userCredentialService - Serviço para credenciais
   * @param {PasswordResetService} passwordResetService - Serviço para tokens de reset
   * @param {RefreshTokenService} refreshTokenService - Serviço para refresh tokens
   */
  constructor(
    private readonly userCredentialService: UserCredentialService,
    private readonly passwordResetService: PasswordResetService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executar caso de uso de reset de password
   *
   * @async
   * @param {string} token - Token de reset de password
   * @param {string} newPassword - Nova password em texto plano (será hasheada)
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se token inválido, expirado ou password fraca
   *
   * @description
   * 1. Valida token de reset de password
   * 2. Altera password do utilizador (hasheada com bcrypt)
   * 3. Revoga todos os tokens de reset (para evitar reutilização)
   * 4. Revoga todas as sessões ativas (força novo login)
   *
   * Revogar todas as sessões garantem se conta foi comprometida,
   * o atacante será automaticamente desconectado.
   */
  async execute(token: string, newPassword: string): Promise<void> {
    const reset = await this.passwordResetService.verifyToken(token);

    await this.userCredentialService.updatePassword(
      reset.userCredential,
      newPassword,
    );

    await this.passwordResetService.revokeAllResetTokens(reset.userCredential);
    await this.refreshTokenService.revokeAllUserRefreshTokens(
      reset.userCredential.user,
    );
  }
}
