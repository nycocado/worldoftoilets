import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PasswordResetEntity, UserCredentialEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: EntityRepository<PasswordResetEntity>,
  ) {}

  async getByToken(token: string): Promise<PasswordResetEntity | null> {
    return this.passwordResetRepository.findOne({ token });
  }

  async getByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
    return this.passwordResetRepository.find({ userCredential });
  }

  async getExpiredTokens(): Promise<PasswordResetEntity[]> {
    return this.passwordResetRepository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async revokeAllResetTokens(
    userCredential: UserCredentialEntity,
  ): Promise<void> {
    const em = this.passwordResetRepository.getEntityManager();
    const tokens = await this.getByUserCredential(userCredential);

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
  }

  async createResetToken(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity> {
    const em = this.passwordResetRepository.getEntityManager();
    await this.revokeAllResetTokens(userCredential);

    const passwordResetTokenExpiration = this.configService.getOrThrow(
      'PASSWORD_RESET_TOKEN_EXPIRATION',
    );

    const expiresInMs = jwtTimeToMilliseconds(passwordResetTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const reset = new PasswordResetEntity();
    reset.userCredential = userCredential;
    reset.expiresAt = expiresAt;

    await em.persistAndFlush(reset);
    return reset;
  }

  async verifyToken(token: string): Promise<PasswordResetEntity> {
    const em = this.passwordResetRepository.getEntityManager();
    const reset = await this.getByToken(token);

    if (!reset) {
      throw new BadRequestException('Token de recuperação inválido');
    }

    if (
      reset.expiresAt < new Date() ||
      (reset.invalidAt && reset.invalidAt < new Date())
    ) {
      throw new BadRequestException('Token de recuperação expirado');
    }

    reset.invalidAt = new Date();
    await em.persistAndFlush(reset);

    return reset;
  }

  async deleteExpiredTokens(): Promise<void> {
    const em = this.passwordResetRepository.getEntityManager();
    const tokens = await this.getExpiredTokens();
    await em.removeAndFlush(tokens);
  }
}
