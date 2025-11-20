import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@modules/user/user.repository';
import { USER_EXCEPTIONS } from '../constants';
import { AUTH_EXCEPTIONS } from '@modules/auth/constants';

/**
 * Caso de uso para desativar a própria conta do utilizador.
 */
@Injectable()
export class DeleteUserSelfUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Desativa a própria conta do utilizador (soft delete).
   *
   * @param {string} publicId O ID público do utilizador autenticado.
   * @param {string} password A senha do utilizador para confirmação.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {UnauthorizedException} Se a senha estiver incorreta.
   * @throws {BadRequestException} Se o utilizador já estiver desativado.
   */
  async execute(publicId: string, password: string): Promise<void> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (!user.credential) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_EXCEPTIONS.INVALID_CREDENTIALS);
    }

    if (user.deactivatedAt) {
      throw new BadRequestException(USER_EXCEPTIONS.USER_ALREADY_DEACTIVATED);
    }

    await this.repository.softDelete(user, user);
  }
}
