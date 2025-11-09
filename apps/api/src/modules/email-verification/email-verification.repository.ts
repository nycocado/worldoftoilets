import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  Transactional,
} from '@mikro-orm/mariadb';
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

  @Transactional()
  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    const emailVerification = new EmailVerificationEntity();
    emailVerification.userCredential = userCredential;
    emailVerification.expiresAt = expiresAt;

    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }

  @Transactional()
  async invalidate(
    emailVerification: EmailVerificationEntity,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    emailVerification.invalidAt = new Date();
    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }

  @Transactional()
  async invalidateAllByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<EmailVerificationEntity[]> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({
      userCredential: userCredential,
    });

    tokens.forEach((token) => {
      token.invalidAt = new Date();
    });

    await em.persistAndFlush(tokens);
    return tokens;
  }

  @Transactional()
  async deleteExpired(): Promise<void> {
    const em = this.repository.getEntityManager();
    const tokens = await this.repository.find({
      expiresAt: { $lt: new Date() },
    });
    await em.removeAndFlush(tokens);
  }

  @Transactional()
  async verifyEmail(
    emailVerification: EmailVerificationEntity,
  ): Promise<EmailVerificationEntity> {
    const em = this.repository.getEntityManager();
    emailVerification.userCredential.emailVerified = true;
    emailVerification.invalidAt = new Date();

    await em.persistAndFlush(emailVerification.userCredential);
    await em.persistAndFlush(emailVerification);
    return emailVerification;
  }
}
