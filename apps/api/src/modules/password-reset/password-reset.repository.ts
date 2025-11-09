import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
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

  async findExpired(): Promise<PasswordResetEntity[]> {
    return this.repository.find({
      expiresAt: { $lt: new Date() },
    });
  }

  @Transactional()
  async create(
    userCredential: UserCredentialEntity,
    expiresAt: Date,
  ): Promise<PasswordResetEntity> {
    const em = this.repository.getEntityManager();
    const passwordReset = new PasswordResetEntity();
    passwordReset.userCredential = userCredential;
    passwordReset.expiresAt = expiresAt;

    await em.persistAndFlush(passwordReset);
    return passwordReset;
  }

  @Transactional()
  async invalidate(
    passwordReset: PasswordResetEntity,
  ): Promise<PasswordResetEntity> {
    const em = this.repository.getEntityManager();
    passwordReset.invalidAt = new Date();
    await em.persistAndFlush(passwordReset);
    return passwordReset;
  }

  @Transactional()
  async invalidateAllByUserCredential(
    userCredential: UserCredentialEntity,
  ): Promise<PasswordResetEntity[]> {
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
    const tokens = await this.findExpired();
    await em.removeAndFlush(tokens);
  }
}
