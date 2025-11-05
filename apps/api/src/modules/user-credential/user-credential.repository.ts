import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCredentialRepository {
  constructor(
    @InjectRepository(UserCredentialEntity)
    private readonly repository: EntityRepository<UserCredentialEntity>,
  ) {}

  async create(
    user: UserEntity,
    email: string,
    password: string,
  ): Promise<UserCredentialEntity> {
    const em = this.getEntityManager();
    const hashedPassword = await bcrypt.hash(password, 12);
    const userCredential = new UserCredentialEntity();
    userCredential.user = user;
    userCredential.email = email;
    userCredential.password = hashedPassword;
    await em.persistAndFlush(userCredential);
    return userCredential;
  }

  async updatePassword(
    userCredential: UserCredentialEntity,
    newPassword: string,
  ): Promise<void> {
    const em = this.getEntityManager();
    userCredential.password = await bcrypt.hash(newPassword, 12);
    await em.persistAndFlush(userCredential);
  }

  private getEntityManager(): EntityManager {
    return this.repository.getEntityManager();
  }
}
