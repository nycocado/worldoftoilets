import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCredentialRepository {
  constructor(
    @InjectRepository(UserCredentialEntity)
    private readonly repository: EntityRepository<UserCredentialEntity>,
  ) {}

  @Transactional()
  async create(
    user: UserEntity,
    email: string,
    password: string,
  ): Promise<UserCredentialEntity> {
    const em = this.repository.getEntityManager();
    const hashedPassword = await bcrypt.hash(password, 12);
    const userCredential = new UserCredentialEntity();
    userCredential.user = user;
    userCredential.email = email;
    userCredential.password = hashedPassword;
    await em.persistAndFlush(userCredential);
    return userCredential;
  }

  @Transactional()
  async updatePassword(
    userCredential: UserCredentialEntity,
    newPassword: string,
  ): Promise<UserCredentialEntity> {
    const em = this.repository.getEntityManager();
    userCredential.password = await bcrypt.hash(newPassword, 12);
    await em.persistAndFlush(userCredential);
    return userCredential;
  }
}
