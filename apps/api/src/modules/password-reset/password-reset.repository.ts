import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { PasswordResetEntity, UserCredentialEntity } from '@database/entities';

@Injectable()
export class PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly repository: EntityRepository<PasswordResetEntity>,
  ) {}

  async findByToken(token: string): Promise<PasswordResetEntity | null> {
    return this.repository.findOne(
      { token: token },
      { populate: ['userCredential', 'userCredential.user'] },
    );
  }

  async findByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
    return this.repository.find({ userCredential: userCredential });
  }

  async findExpired(): Promise<PasswordResetEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<PasswordResetEntity> {
    const em = this.getEntityManager();
    const passwordReset = new PasswordResetEntity();
    passwordReset.userCredential = userCredential;
    passwordReset.expiresAt = expiresAt;

    await em.persistAndFlush(passwordReset);
    return passwordReset;
  }

  async invalidate(passwordReset: PasswordResetEntity): Promise<void> {
    const em = this.getEntityManager();
    passwordReset.invalidAt = new Date();
    await em.persistAndFlush(passwordReset);
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

  private getEntityManager(): EntityManager {
    return this.repository.getEntityManager();
  }
}
