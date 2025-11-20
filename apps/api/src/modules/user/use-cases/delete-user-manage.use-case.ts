import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@modules/user/user.repository';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para desativar um utilizador (administração).
 */
@Injectable()
export class DeleteUserManageUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Desativa um utilizador (soft delete).
   *
   * @param {string} publicId O ID público do utilizador a desativar.
   * @param {string} adminPublicId O ID público do administrador que realiza a ação.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se o administrador tentar desativar a própria conta.
   * @throws {BadRequestException} Se o utilizador já estiver desativado.
   */
  async execute(publicId: string, adminPublicId: string): Promise<void> {
    if (publicId === adminPublicId) {
      throw new BadRequestException(USER_EXCEPTIONS.CANNOT_DEACTIVATE_SELF);
    }

    const user = await this.repository.findByPublicId(publicId);
    const admin = await this.repository.findByPublicId(adminPublicId);

    if (!user || !admin) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (user.deactivatedAt) {
      throw new BadRequestException(USER_EXCEPTIONS.USER_ALREADY_DEACTIVATED);
    }

    await this.repository.softDelete(user, admin);
  }
}
