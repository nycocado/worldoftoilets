import { Injectable } from '@nestjs/common';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import { UserCredentialRepository } from '@modules/user-credential/user-credential.repository';

/**
 * Contém a lógica de negócio para as operações de credenciais de utilizador.
 */
@Injectable()
export class UserCredentialService {
  constructor(
    private readonly userCredentialRepository: UserCredentialRepository,
  ) {}

  /**
   * Cria uma nova credencial de utilizador.
   *
   * @param {UserEntity} user O utilizador associado.
   * @param {string} email O email da credencial.
   * @param {string} password A senha da credencial.
   * @returns {Promise<UserCredentialEntity>} A entidade da credencial criada.
   */
  async createUserCredential(
    user: UserEntity,
    email: string,
    password: string,
  ): Promise<UserCredentialEntity> {
    return this.userCredentialRepository.create(user, email, password);
  }

  /**
   * Atualiza a senha de uma credencial de utilizador.
   *
   * @param {UserCredentialEntity} userCredential A credencial a ser atualizada.
   * @param {string} newPassword A nova senha.
   * @returns {Promise<UserCredentialEntity>} A entidade da credencial atualizada.
   */
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
