import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RoleApiName } from '@database/entities';
import { RoleService } from '@modules/role';
import { UserRepository } from '@modules/user/user.repository';
import { UserAdminResponseDto } from '../dto';
import { USER_EXCEPTIONS } from '../constants';

/**
 * Caso de uso para remover cargos de um utilizador (administração).
 */
@Injectable()
export class RemoveRolesManageUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Remove cargos de um utilizador.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a remover.
   * @returns {Promise<UserAdminResponseDto>} As informações atualizadas do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se algum cargo não for encontrado.
   * @throws {BadRequestException} Se algum cargo não estiver atribuído ao utilizador.
   */
  async execute(
    publicId: string,
    roles: RoleApiName[],
  ): Promise<UserAdminResponseDto> {
    const user = await this.repository.findByPublicId(publicId);

    if (!user) {
      throw new NotFoundException(USER_EXCEPTIONS.USER_NOT_FOUND);
    }

    const foundRoles = await this.roleService.getRolesByApiNames(roles);
    if (foundRoles.length !== roles.length) {
      throw new BadRequestException(USER_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    const userRoleApiNames = user.roles.getItems().map((role) => role.apiName);
    const notAssigned = roles.some((role) => !userRoleApiNames.includes(role));
    if (notAssigned) {
      throw new BadRequestException(USER_EXCEPTIONS.ROLE_NOT_ASSIGNED);
    }

    await this.roleService.removeRolesFromUser(user, roles);

    return plainToInstance(UserAdminResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
