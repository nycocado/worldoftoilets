import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectRepository(UserCredentialEntity)
    private readonly userCredentialRepository: EntityRepository<UserCredentialEntity>,
  ) {}

  async createUserCredential(
    user: UserEntity,
    email: string,
    password: string,
  ): Promise<UserCredentialEntity> {
    const em = this.userCredentialRepository.getEntityManager();
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
    const em = this.userCredentialRepository.getEntityManager();
    userCredential.password = await bcrypt.hash(newPassword, 12);
    await em.persistAndFlush(userCredential);
  }
}
