import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { UserCredentialService } from '@modules/user-credential/user-credential.service';
import { PasswordResetService } from '@modules/password-reset/password-reset.service';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';

/**
 * Implementa o caso de uso de reset de password.
 */
@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userCredentialService: UserCredentialService,
    private readonly passwordResetService: PasswordResetService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Executa a lógica de reset de password.
   *
   * @param {string} token O token de reset de password.
   * @param {string} newPassword A nova password em texto plano.
   * @returns {Promise<void>}
   * @throws {BadRequestException} Se o token for inválido, expirado ou a password for fraca.
   */
  @Transactional()
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
