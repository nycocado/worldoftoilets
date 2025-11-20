import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserAdminResponseDto } from '../dto';

export const ApiSwaggerAssignRolesManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atribuir cargos a utilizador (manage)',
      description: 'Atribui um ou mais cargos a um utilizador específico.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Cargos atribuídos com sucesso.',
      type: UserAdminResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'Cargos inválidos ou já atribuídos ao utilizador.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão MODIFY_ROLES_USERS.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
