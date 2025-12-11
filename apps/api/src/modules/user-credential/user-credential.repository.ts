import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';
import { UserCredentialEntity, UserEntity } from '@database/entities';
import * as bcrypt from 'bcrypt';

/**
 * Gerencia o acesso e a persistência de dados para a entidade UserCredential.
 */
@Injectable()
export class UserCredentialRepository {
  constructor(
    @InjectRepository(UserCredentialEntity)
    private readonly repository: EntityRepository<UserCredentialEntity>,
  ) {}

  /**
   * Cria uma nova credencial de utilizador.
   *
   * @param {UserEntity} user O utilizador associado.
   * @param {string} email O email da credencial.
   * @param {string} password A senha da credencial.
   * @returns {Promise<UserCredentialEntity>} A entidade da credencial criada.
   */
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
    em.persist(userCredential);
    await em.flush();
    return userCredential;
  }

  /**
   * Atualiza a senha de uma credencial de utilizador.
   *
   * @param {UserCredentialEntity} userCredential A credencial a ser atualizada.
   * @param {string} newPassword A nova senha.
   * @returns {Promise<UserCredentialEntity>} A entidade da credencial atualizada.
   */
  @Transactional()
  async updatePassword(
    userCredential: UserCredentialEntity,
    newPassword: string,
  ): Promise<UserCredentialEntity> {
    const em = this.repository.getEntityManager();
    userCredential.password = await bcrypt.hash(newPassword, 12);
    em.persist(userCredential);
    await em.flush();
    return userCredential;
  }
}
