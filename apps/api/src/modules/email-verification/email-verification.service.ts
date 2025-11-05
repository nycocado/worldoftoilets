import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EmailVerificationEntity,
  UserCredentialEntity,
} from '@database/entities';
import { EntityRepository } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { jwtTimeToMilliseconds } from '@common/utils/jwt-time.util';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: EntityRepository<EmailVerificationEntity>,
  ) {}

  async getByToken(token: string): Promise<EmailVerificationEntity | null> {
    return this.emailVerificationRepository.findOne({ token });
  }

  async getByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    return this.emailVerificationRepository.find({ userCredential });
  }

  async getExpiredTokens(): Promise<EmailVerificationEntity[]> {
    return this.emailVerificationRepository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async revokeAllVerificationTokens(
    userCredential: UserCredentialEntity,
  ): Promise<void> {
    const em = this.emailVerificationRepository.getEntityManager();
    const tokens = await this.getByUserCredential(userCredential);

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
  }

  async createVerificationToken(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity> {
    const em = this.emailVerificationRepository.getEntityManager();
    await this.revokeAllVerificationTokens(userCredential);

    const emailVerificationTokenExpiration = this.configService.getOrThrow(
      'EMAIL_VERIFICATION_TOKEN_EXPIRATION',
    );

    const expiresInMs = jwtTimeToMilliseconds(emailVerificationTokenExpiration);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const verification = new EmailVerificationEntity();
    verification.userCredential = userCredential;
    verification.expiresAt = expiresAt;

    await em.persistAndFlush(verification);
    return verification;
  }

  async verifyToken(token: string): Promise<UserCredentialEntity> {
    const em = this.emailVerificationRepository.getEntityManager();
    const verification = await this.getByToken(token);

    if (!verification) {
      throw new BadRequestException('Token de verificação inválido');
    }

    if (
      verification.expiresAt < new Date() ||
      (verification.invalidAt && verification.invalidAt < new Date())
    ) {
      throw new BadRequestException('Token de verificação expirado');
    }

    verification.userCredential.emailVerified = true;
    verification.invalidAt = new Date();

    em.persist(verification.userCredential);
    em.persist(verification);
    await em.flush();

    return verification.userCredential;
  }

  async deleteExpiredTokens(): Promise<void> {
    const em = this.emailVerificationRepository.getEntityManager();
    const tokens = await this.getExpiredTokens();
    await em.removeAndFlush(tokens);
  }
}
