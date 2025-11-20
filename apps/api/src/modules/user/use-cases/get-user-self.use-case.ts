import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/user.repository';
import { UserSelfResponseDto } from '../dto';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para obter informações do próprio utilizador.
 */
@Injectable()
export class GetUserSelfUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Obtém as informações do próprio utilizador.
   *
   * @param {string} publicId O ID público do utilizador autenticado.
   * @returns {Promise<UserSelfResponseDto>} As informações do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(publicId: string): Promise<UserSelfResponseDto> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    return plainToInstance(UserSelfResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
