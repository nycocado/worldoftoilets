import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionApiName, UserEntity, UserIcon } from '@database/entities';
import { UserRepository } from '@modules/user/user.repository';
import { USER_EXCEPTIONS } from '@modules/user/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para as operações de utilizadores.
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Busca um utilizador pelo seu ID público.
   *
   * @param {string} publicId O ID público do utilizador.
   * @returns {Promise<UserEntity>} O utilizador encontrado.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async getUserByPublicId(publicId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  /**
   * Busca um utilizador pelo seu email.
   *
   * @param {string} email O email do utilizador.
   * @returns {Promise<UserEntity>} O utilizador encontrado.
   * @throws {BadRequestException} Se o utilizador não for encontrado.
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  /**
   * Busca um utilizador pelo token de refresh.
   *
   * @param {string} token O token de refresh.
   * @returns {Promise<UserEntity>} O utilizador encontrado.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async getUserByRefreshToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findByRefreshToken(token);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  /**
   * Verifica se existe um utilizador com o email especificado.
   *
   * @param {string} email O email a verificar.
   * @returns {Promise<boolean>} `true` se existir um utilizador com este email.
   */
  async verifyUserExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  /**
   * Verifica se um utilizador possui alguma das permissões especificadas.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {PermissionApiName[]} apiNames Os nomes das permissões a verificar.
   * @returns {Promise<boolean>} `true` se o utilizador possuir alguma das permissões.
   */
  async verifyUserHasPermissions(
    publicId: string,
    apiNames: PermissionApiName[],
  ): Promise<boolean> {
    return this.userRepository.hasPermissions(publicId, apiNames);
  }

  /**
   * Cria um novo utilizador.
   *
   * @param {string} name O nome do utilizador.
   * @param {UserIcon | undefined} icon O ícone do utilizador.
   * @param {string} birthDate A data de nascimento.
   * @returns {Promise<UserEntity>} O utilizador criado.
   */
  async createUser(
    name: string,
    icon: UserIcon | undefined,
    birthDate: string,
  ): Promise<UserEntity> {
    return this.userRepository.create(name, icon, birthDate);
  }

  /**
   * Faz soft delete de um utilizador.
   *
   * @param {UserEntity} user O utilizador a ser desativado.
   * @param {UserEntity} deactivatedBy O utilizador que desativou.
   * @returns {Promise<void>}
   */
  async softDeleteUser(
    user: UserEntity,
    deactivatedBy: UserEntity,
  ): Promise<void> {
    return this.userRepository.softDelete(user, deactivatedBy);
  }

  /**
   * Faz undelete de um utilizador.
   *
   * @param {UserEntity} user O utilizador a ser restaurado.
   * @returns {Promise<UserEntity>} O utilizador restaurado.
   */
  async undeleteUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.undelete(user);
  }
}
