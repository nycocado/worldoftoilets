import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/user.repository';
import { UserAdminResponseDto } from '../dto';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para restaurar um utilizador desativado (administração).
 */
@Injectable()
export class UndeleteUserManageUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Restaura um utilizador desativado.
   *
   * @param {string} publicId O ID público do utilizador a restaurar.
   * @returns {Promise<UserAdminResponseDto>} As informações do utilizador restaurado.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se o utilizador não estiver desativado.
   */
  async execute(publicId: string): Promise<UserAdminResponseDto> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (!user.deactivatedAt) {
      throw new BadRequestException(USER_EXCEPTIONS.USER_NOT_DEACTIVATED);
    }

    await this.repository.undelete(user);

    return plainToInstance(UserAdminResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
