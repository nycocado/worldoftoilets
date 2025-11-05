import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import {
  EmailVerificationEntity,
  UserCredentialEntity,
} from '@database/entities';

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly repository: EntityRepository<EmailVerificationEntity>,
  ) {}

  async findByToken(token: string): Promise<EmailVerificationEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['userCredential', 'userCredential.user'] },
    );
  }

  async findByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    return this.repository.find({ userCredential: userCredential });
  }

  async findExpired(): Promise<EmailVerificationEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<EmailVerificationEntity> {
    const em = this.getEntityManager();
    const emailVerification = new EmailVerificationEntity();
    emailVerification.userCredential = userCredential;
    emailVerification.expiresAt = expiresAt;

    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }

  async invalidate(emailVerification: EmailVerificationEntity): Promise<void> {
    const em = this.getEntityManager();
    emailVerification.invalidAt = new Date();
    await em.persistAndFlush(emailVerification);
  }

  async invalidateAllByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<void> {
    const em = this.getEntityManager();
    const tokens = await this.repository.find({
      userCredential: userCredential,
    });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
  }

  async deleteExpired(): Promise<void> {
    const em = this.getEntityManager();
    const tokens = await this.repository.find({
      expiresAt: { $lt: new Date() },
    });
    await em.removeAndFlush(tokens);
  }

  async verifyEmail(emailVerification: EmailVerificationEntity): Promise<void> {
    const em = this.getEntityManager();
    emailVerification.userCredential.emailVerified = true;
    emailVerification.invalidAt = new Date();

    await em.persistAndFlush(emailVerification.userCredential);
    await em.persistAndFlush(emailVerification);
  }

  private getEntityManager(): EntityManager {
    return this.repository.getEntityManager();
  }
}
