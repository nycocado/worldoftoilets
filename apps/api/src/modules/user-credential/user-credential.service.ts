import { Injectable } from '@nestjs/common';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import { UserCredentialRepository } from '@modules/user-credential/user-credential.repository';

@Injectable()
export class UserCredentialService {
  constructor(
    private readonly userCredentialRepository: UserCredentialRepository,
  ) {}

  async createUserCredential(
    user: UserEntity,
    email: string,
    password: string,
  ): Promise<UserCredentialEntity> {
    return this.userCredentialRepository.create(user, email, password);
  }

  async updatePassword(
    userCredential: UserCredentialEntity,
    newPassword: string,
  ): Promise<UserCredentialEntity> {
    return this.userCredentialRepository.updatePassword(
      userCredential,
      newPassword,
    );
  }
}
