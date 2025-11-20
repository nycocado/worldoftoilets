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

export const ApiSwaggerRemoveRolesManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Remover cargos de utilizador (manage)',
      description: 'Remove um ou mais cargos de um utilizador específico.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Cargos removidos com sucesso.',
      type: UserAdminResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'Cargos inválidos ou não atribuídos ao utilizador.',
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
