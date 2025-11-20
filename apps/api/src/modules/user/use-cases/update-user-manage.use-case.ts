import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserIcon } from '@database/entities';
import { UserRepository } from '@modules/user/user.repository';
import { UserAdminResponseDto } from '../dto';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para atualizar informações de um utilizador (administração).
 */
@Injectable()
export class UpdateUserManageUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Atualiza as informações de um utilizador específico.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {string} [name] O novo nome.
   * @param {UserIcon} [icon] O novo ícone.
   * @param {string} [birthDate] A nova data de nascimento.
   * @returns {Promise<UserAdminResponseDto>} As informações atualizadas do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  async execute(
    publicId: string,
    name?: string,
    icon?: UserIcon,
    birthDate?: string,
  ): Promise<UserAdminResponseDto> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    await this.repository.update(user, name, icon, birthDate);

    return plainToInstance(UserAdminResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
