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
 * Caso de uso para atribuir cargos a um utilizador (administração).
 */
@Injectable()
export class AssignRolesManageUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Atribui cargos a um utilizador.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {RoleApiName[]} roles Os nomes de API dos cargos a atribuir.
   * @returns {Promise<UserAdminResponseDto>} As informações atualizadas do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se algum cargo não for encontrado.
   * @throws {BadRequestException} Se algum cargo já estiver atribuído ao utilizador.
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
    const alreadyAssigned = roles.some((role) =>
      userRoleApiNames.includes(role),
    );
    if (alreadyAssigned) {
      throw new BadRequestException(USER_EXCEPTIONS.ROLE_ALREADY_ASSIGNED);
    }

    await this.roleService.assignRolesToUser(user, roles);

    return plainToInstance(UserAdminResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
