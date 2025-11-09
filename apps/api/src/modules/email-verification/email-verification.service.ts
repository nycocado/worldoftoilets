import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  EmailVerificationEntity,
  UserCredentialEntity,
} from '@database/entities';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { EmailVerificationRepository } from '@modules/email-verification/email-verification.repository';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly verifyTokenUseCase: VerifyEmailUseCase,
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async revokeAllVerificationTokens(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
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
    const expiresInMs = textTimeToMilliseconds(
      emailVerificationTokenExpiration,
    );
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.emailVerificationRepository.create(userCredential, expiresAt);
  }

  async verifyToken(token: string): Promise<UserCredentialEntity> {
    return this.verifyTokenUseCase.execute(token);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    return this.emailVerificationRepository.deleteExpired();
  }
}
