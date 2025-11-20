import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/user.repository';
import { UserAdminResponseDto } from '../dto';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para obter informações de um utilizador (administração).
 */
@Injectable()
export class GetUserManageUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Obtém as informações de um utilizador específico.
   *
   * @param {string} publicId O ID público do utilizador.
   * @returns {Promise<UserAdminResponseDto>} As informações do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(publicId: string): Promise<UserAdminResponseDto> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return plainToInstance(UserAdminResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
