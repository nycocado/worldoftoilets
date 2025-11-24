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

/**
 * Contém a lógica de negócio para as operações de verificação de email.
 */
@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly verifyTokenUseCase: VerifyEmailUseCase,
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

  /**
   * Revoga todos os tokens de verificação de email para uma credencial de utilizador.
   *
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<EmailVerificationEntity[]>} A lista de entidades de verificação de email revogadas.
   */
  async revokeAllVerificationTokens(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    return this.emailVerificationRepository.invalidateAllByUserCredential(
      userCredential,
    );
  }

  /**
   * Cria um novo token de verificação de email.
   *
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<EmailVerificationEntity>} A entidade de verificação de email criada.
   */
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

  /**
   * Verifica um token de verificação de email.
   *
   * @param {string} token O token a ser verificado.
   * @returns {Promise<UserCredentialEntity>} A credencial do utilizador associada ao token.
   */
  async verifyToken(token: string): Promise<UserCredentialEntity> {
    return this.verifyTokenUseCase.execute(token);
  }

  /**
   * Remove permanentemente os tokens de verificação de email expirados.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    return this.emailVerificationRepository.deleteExpired();
  }
}
