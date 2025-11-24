import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCredentialEntity } from '@database/entities';
import { EMAIL_VERIFICATION_EXCEPTIONS } from '@modules/email-verification/constants';
import { EmailVerificationRepository } from '@modules/email-verification/email-verification.repository';

/**
 * Contém a lógica de negócio para a verificação de um token de email.
 */
@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

  /**
   * Verifica um token de verificação de email, e marca o email do utilizador como verificado.
   *
   * @param {string} token O token a ser verificado.
   * @returns {Promise<UserCredentialEntity>} A credencial do utilizador associada ao token.
   * @throws {BadRequestException} Se o token for inválido ou expirado.
   */
  async execute(token: string): Promise<UserCredentialEntity> {
    const verification =
      await this.emailVerificationRepository.findByToken(token);

    if (!verification) {
      throw new BadRequestException(
        EMAIL_VERIFICATION_EXCEPTIONS.VERIFICATION_TOKEN_INVALID,
      );
    }

    if (
      verification.expiresAt < new Date() ||
      (verification.invalidAt && verification.invalidAt < new Date())
    ) {
      throw new BadRequestException(
        EMAIL_VERIFICATION_EXCEPTIONS.VERIFICATION_TOKEN_EXPIRED,
      );
    }

    await this.emailVerificationRepository.verifyEmail(verification);

    return verification.userCredential;
  }
}
