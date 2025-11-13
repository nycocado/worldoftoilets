import { Injectable } from '@nestjs/common';
import { PasswordResetEntity, UserCredentialEntity } from '@database/entities';
import { ConfigService } from '@nestjs/config';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { PasswordResetRepository } from '@modules/password-reset/password-reset.repository';
import { VerifyTokenUseCase } from '@modules/password-reset/use-cases/verify-token.use-case';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly configService: ConfigService,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  async revokeAllResetTokens(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
    return this.passwordResetRepository.invalidateAllByUserCredential(
      userCredential,
    );
  }

  async createResetToken(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity> {
    const passwordResetTokenExpiration = this.configService.getOrThrow(
      'PASSWORD_RESET_TOKEN_EXPIRATION',
    );
    const expiresInMs = textTimeToMilliseconds(passwordResetTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);
    return this.passwordResetRepository.create(userCredential, expiresAt);
  }

  async verifyToken(token: string): Promise<PasswordResetEntity> {
    return this.verifyTokenUseCase.execute(token);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    await this.passwordResetRepository.deleteExpired();
  }
}
