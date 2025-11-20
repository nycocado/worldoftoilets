import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/user.repository';
import { UserAdminResponseDto } from '../dto';

/**
 * Caso de uso para listar utilizadores (administração).
 */
@Injectable()
export class GetUsersManageUseCase {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Lista utilizadores com paginação e filtros.
   *
   * @param {string} [search] Termo de pesquisa para nome ou email.
   * @param {boolean} [includeDeactivated] Incluir utilizadores desativados.
   * @param {boolean} [pageable] Aplicar paginação.
   * @param {number} [page] Número da página.
   * @param {number} [size] Tamanho da página.
   * @param {Date} [timestamp] Timestamp de referência para paginação.
   * @returns {Promise<UserAdminResponseDto[]>} Lista de utilizadores.
   */
  async execute(
    search?: string,
    includeDeactivated?: boolean,
    pageable?: boolean,
    page?: number,
    size?: number,
    timestamp?: Date,
  ): Promise<UserAdminResponseDto[]> {
    const users = await this.repository.findAll(
      search,
      includeDeactivated,
      pageable,
      page,
      size,
      timestamp,
    );

    return users.map((user) =>
      plainToInstance(UserAdminResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
