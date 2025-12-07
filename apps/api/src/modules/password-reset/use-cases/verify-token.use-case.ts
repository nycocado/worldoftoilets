import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordResetEntity } from '@database/entities';
import { PASSWORD_RESET_EXCEPTIONS } from '@modules/password-reset/constants';
import { PasswordResetRepository } from '@modules/password-reset/password-reset.repository';

/**
 * Contém a lógica de negócio para a verificação de um token de redefinição de senha.
 */
@Injectable()
export class VerifyTokenUseCase {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  /**
   * Executa a lógica de verificação do token.
   *
   * @param {string} token O token de redefinição de senha.
   * @returns {Promise<PasswordResetEntity>} A entidade do token de redefinição.
   * @throws {BadRequestException} Se o token for inválido ou expirado.
   */
  async execute(token: string): Promise<PasswordResetEntity> {
    const reset = await this.passwordResetRepository.findByToken(token);

    if (!reset) {
      throw new BadRequestException(
        PASSWORD_RESET_EXCEPTIONS.RECOVERY_TOKEN_INVALID,
      );
    }

    if (reset.isExpired) {
      throw new BadRequestException(
        PASSWORD_RESET_EXCEPTIONS.RECOVERY_TOKEN_EXPIRED,
      );
    }

    return reset;
  }
}
