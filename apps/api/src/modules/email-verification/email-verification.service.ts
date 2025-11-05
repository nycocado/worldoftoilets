import { Injectable } from '@nestjs/common';
import {
  EmailVerificationEntity,
  UserCredentialEntity,
} from '@database/entities';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { EmailVerificationRepository } from '@modules/email-verification/email-verification.repository';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly verifyTokenUseCase: VerifyEmailUseCase,
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async getByToken(token: string): Promise<EmailVerificationEntity | null> {
    return this.emailVerificationRepository.findByToken(token);
  }

  async getByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    return this.emailVerificationRepository.findByUserCredential(
      userCredential,
    );
  }

  async getExpiredTokens(): Promise<EmailVerificationEntity[]> {
    return this.emailVerificationRepository.findExpired();
  }

  async revokeAllVerificationTokens(
    userCredential: UserCredentialEntity,
  ): Promise<void> {
    return this.emailVerificationRepository.invalidateAllByUserCredential(
      userCredential,
    );
  }

  async createVerificationToken(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity> {
    await this.revokeAllVerificationTokens(userCredential);
    const emailVerificationTokenExpiration = this.configService.getOrThrow(
      'EMAIL_VERIFICATION_TOKEN_EXPIRATION',
    );
    const expiresInMs = jwtTimeToMilliseconds(emailVerificationTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.emailVerificationRepository.create(userCredential, expiresAt);
  }

  async verifyToken(token: string): Promise<UserCredentialEntity> {
    return this.verifyTokenUseCase.execute(token);
  }

  async deleteExpiredTokens(): Promise<void> {
    return this.emailVerificationRepository.deleteExpired();
  }
}
