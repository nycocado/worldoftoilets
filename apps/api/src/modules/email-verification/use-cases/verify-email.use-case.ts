import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCredentialEntity } from '@database/entities';
import { EMAIL_VERIFICATION_EXCEPTIONS } from '@modules/email-verification/constants';
import { EmailVerificationRepository } from '@modules/email-verification/email-verification.repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

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
