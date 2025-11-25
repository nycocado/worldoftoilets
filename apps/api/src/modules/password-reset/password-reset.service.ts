import { Injectable } from '@nestjs/common';
import { PasswordResetEntity, UserCredentialEntity } from '@database/entities';
import { ConfigService } from '@nestjs/config';
import { textTimeToMilliseconds } from '@common/utils/jwt-time.util';
import { PasswordResetRepository } from '@modules/password-reset/password-reset.repository';
import { VerifyTokenUseCase } from '@modules/password-reset/use-cases/verify-token.use-case';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Contém a lógica de negócio para as operações de redefinição de senha.
 */
@Injectable()
export class PasswordResetService {
  constructor(
    private readonly configService: ConfigService,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  /**
   * Revoga todos os tokens de redefinição de senha para uma credencial de utilizador.
   *
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<PasswordResetEntity[]>} A lista de entidades de token de redefinição de senha revogadas.
   */
  async revokeAllResetTokens(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
    return this.passwordResetRepository.invalidateAllByUserCredential(
      userCredential,
    );
  }

  /**
   * Cria um novo token de redefinição de senha.
   *
   * @param {UserCredentialEntity} userCredential A credencial do utilizador.
   * @returns {Promise<PasswordResetEntity>} A entidade do token de redefinição de senha criado.
   */
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

  /**
   * Verifica um token de redefinição de senha.
   *
   * @param {string} token O token a ser verificado.
   * @returns {Promise<PasswordResetEntity>} A entidade do token de redefinição de senha.
   */
  async verifyToken(token: string): Promise<PasswordResetEntity> {
    return this.verifyTokenUseCase.execute(token);
  }

  /**
   * Remove permanentemente os tokens de redefinição de senha expirados.
   * Este método é executado como um Cron Job diário.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    await this.passwordResetRepository.deleteExpired();
  }
}
