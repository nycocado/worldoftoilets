import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { USER_MESSAGES } from './constants';
import {
  UpdateUserRequestDto,
  GetUsersManageRequestDto,
  DeleteUserSelfRequestDto,
  UserSelfResponseDto,
  UserAdminResponseDto,
  AssignRolesManageRequestDto,
  RemoveRolesManageRequestDto,
} from './dto';
import {
  GetUserSelfUseCase,
  UpdateUserSelfUseCase,
  DeleteUserSelfUseCase,
  GetUsersManageUseCase,
  GetUserManageUseCase,
  UpdateUserManageUseCase,
  DeleteUserManageUseCase,
  UndeleteUserManageUseCase,
  AssignRolesManageUseCase,
  RemoveRolesManageUseCase,
} from './use-cases';
import {
  ApiSwaggerGetUserSelf,
  ApiSwaggerUpdateUserSelf,
  ApiSwaggerDeleteUserSelf,
  ApiSwaggerGetUsersManage,
} from './swagger';
import { ApiSwaggerGetUserManage } from '@modules/user/swagger/get-user-manage.swagger';
import { ApiSwaggerUpdateUserManage } from '@modules/user/swagger/update-user-manage.swagger';
import { ApiSwaggerDeleteUserManage } from '@modules/user/swagger/delete-user-manage.swagger';
import { ApiSwaggerUndeleteUserManage } from '@modules/user/swagger/undelete-user-manage.swagger';
import { ApiSwaggerAssignRolesManage } from '@modules/user/swagger/assign-roles-manage.swagger';
import { ApiSwaggerRemoveRolesManage } from '@modules/user/swagger/remove-roles-manage.swagger';

/**
 * Gerencia as requisições HTTP para operações relacionadas a utilizadores.
 */
@Controller('user')
export class UserController {
  constructor(
    private readonly getUserSelfUseCase: GetUserSelfUseCase,
    private readonly updateUserSelfUseCase: UpdateUserSelfUseCase,
    private readonly deleteUserSelfUseCase: DeleteUserSelfUseCase,
    private readonly getUsersManageUseCase: GetUsersManageUseCase,
    private readonly getUserManageUseCase: GetUserManageUseCase,
    private readonly updateUserManageUseCase: UpdateUserManageUseCase,
    private readonly deleteUserManageUseCase: DeleteUserManageUseCase,
    private readonly undeleteUserManageUseCase: UndeleteUserManageUseCase,
    private readonly assignRolesManageUseCase: AssignRolesManageUseCase,
    private readonly removeRolesManageUseCase: RemoveRolesManageUseCase,
  ) {}

  /**
   * Obtém as informações do próprio utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<UserSelfResponseDto>>} As informações do utilizador.
   */
  @ApiSwaggerGetUserSelf()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  async getUserSelf(
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<UserSelfResponseDto>> {
    const result = await this.getUserSelfUseCase.execute(user.publicId);
    return new ApiResponseDto(USER_MESSAGES.USER_RETRIEVED, result);
  }

  /**
   * Atualiza as informações do próprio utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {UpdateUserRequestDto} updateUserDto Os dados a atualizar.
   * @returns {Promise<ApiResponseDto<UserSelfResponseDto>>} As informações atualizadas.
   */
  @ApiSwaggerUpdateUserSelf()
  @UseGuards(JwtAuthGuard)
  @Patch('self')
  async updateUserSelf(
    @User() user: jwtTypes.RequestUser,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<ApiResponseDto<UserSelfResponseDto>> {
    const result = await this.updateUserSelfUseCase.execute(
      user.publicId,
      updateUserDto.name,
      updateUserDto.icon,
      updateUserDto.birthDate,
    );
    return new ApiResponseDto(USER_MESSAGES.USER_UPDATED, result);
  }

  /**
   * Desativa a própria conta do utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {DeleteUserSelfRequestDto} deleteUserSelfDto Os dados de confirmação.
   * @returns {Promise<ApiResponseDto<void>>} Confirmação da desativação.
   */
  @ApiSwaggerDeleteUserSelf()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_SELF_USER)
  @Delete('self')
  async deleteUserSelf(
    @User() user: jwtTypes.RequestUser,
    @Body() deleteUserSelfDto: DeleteUserSelfRequestDto,
  ): Promise<ApiResponseDto<void>> {
    await this.deleteUserSelfUseCase.execute(
      user.publicId,
      deleteUserSelfDto.password,
    );
    return new ApiResponseDto(USER_MESSAGES.USER_DEACTIVATED);
  }

  /**
   * Lista utilizadores com paginação e filtros.
   *
   * @param {GetUsersManageRequestDto} getUsersDto Os parâmetros de pesquisa e paginação.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto[]>>} A lista de utilizadores.
   */
  @ApiSwaggerGetUsersManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_USERS)
  @Get('manage')
  async getUsersManage(
    @Query() getUsersDto: GetUsersManageRequestDto,
  ): Promise<ApiResponseDto<UserAdminResponseDto[]>> {
    const result = await this.getUsersManageUseCase.execute(
      getUsersDto.search,
      getUsersDto.includeDeactivated,
      getUsersDto.pageable,
      getUsersDto.page,
      getUsersDto.size,
      getUsersDto.timestamp,
    );
    return new ApiResponseDto(USER_MESSAGES.USERS_LISTED, result);
  }

  /**
   * Obtém as informações de um utilizador específico.
   *
   * @param {string} publicId O ID público do utilizador.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto>>} As informações do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  @ApiSwaggerGetUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_USERS)
  @Get(':publicId/manage')
  async getUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<UserAdminResponseDto>> {
    const result = await this.getUserManageUseCase.execute(publicId);
    return new ApiResponseDto(USER_MESSAGES.USER_RETRIEVED, result);
  }

  /**
   * Atualiza as informações de um utilizador.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {UpdateUserRequestDto} updateUserDto Os dados a atualizar.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto>>} As informações atualizadas.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  @ApiSwaggerUpdateUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_USERS)
  @Patch(':publicId/manage')
  async updateUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<ApiResponseDto<UserAdminResponseDto>> {
    const result = await this.updateUserManageUseCase.execute(
      publicId,
      updateUserDto.name,
      updateUserDto.icon,
      updateUserDto.birthDate,
    );
    return new ApiResponseDto(USER_MESSAGES.USER_UPDATED, result);
  }

  /**
   * Desativa um utilizador.
   *
   * @param {string} publicId O ID público do utilizador a desativar.
   * @param {jwtTypes.RequestUser} admin O administrador que realiza a ação.
   * @returns {Promise<ApiResponseDto<void>>} Confirmação da desativação.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se tentar desativar a própria conta.
   */
  @ApiSwaggerDeleteUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DEACTIVATE_USER)
  @Delete(':publicId/manage')
  async deleteUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() admin: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<void>> {
    await this.deleteUserManageUseCase.execute(publicId, admin.publicId);
    return new ApiResponseDto(USER_MESSAGES.USER_DEACTIVATED);
  }

  /**
   * Restaura um utilizador desativado.
   *
   * @param {string} publicId O ID público do utilizador a restaurar.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto>>} As informações do utilizador restaurado.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se o utilizador não estiver desativado.
   */
  @ApiSwaggerUndeleteUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.ACTIVATE_USER)
  @Put(':publicId/manage/undelete')
  async undeleteUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<UserAdminResponseDto>> {
    const result = await this.undeleteUserManageUseCase.execute(publicId);
    return new ApiResponseDto(USER_MESSAGES.USER_UNDELETED, result);
  }

  /**
   * Atribui cargos a um utilizador.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {AssignRolesManageRequestDto} assignRolesDto Os cargos a atribuir.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto>>} As informações atualizadas.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se algum cargo for inválido ou já atribuído.
   */
  @ApiSwaggerAssignRolesManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.MODIFY_ROLES_USERS)
  @Put(':publicId/manage/roles')
  async assignRolesManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() assignRolesDto: AssignRolesManageRequestDto,
  ): Promise<ApiResponseDto<UserAdminResponseDto>> {
    const result = await this.assignRolesManageUseCase.execute(
      publicId,
      assignRolesDto.roles,
    );
    return new ApiResponseDto(USER_MESSAGES.ROLES_ASSIGNED, result);
  }

  /**
   * Remove cargos de um utilizador.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {RemoveRolesRequestDto} removeRolesDto Os cargos a remover.
   * @returns {Promise<ApiResponseDto<UserAdminResponseDto>>} As informações atualizadas.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   * @throws {BadRequestException} Se algum cargo for inválido ou não atribuído.
   */
  @ApiSwaggerRemoveRolesManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.MODIFY_ROLES_USERS)
  @Delete(':publicId/manage/roles')
  async removeRolesManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() removeRolesDto: RemoveRolesManageRequestDto,
  ): Promise<ApiResponseDto<UserAdminResponseDto>> {
    const result = await this.removeRolesManageUseCase.execute(
      publicId,
      removeRolesDto.roles,
    );
    return new ApiResponseDto(USER_MESSAGES.ROLES_REMOVED, result);
  }
}
