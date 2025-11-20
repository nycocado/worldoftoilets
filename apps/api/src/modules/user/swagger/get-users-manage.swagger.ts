import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UserAdminResponseDto } from '../dto';

export const ApiSwaggerGetUsersManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar utilizadores',
      description:
        'Lista utilizadores com paginação e filtros. Permite pesquisar por nome ou email.',
    }),
    ApiOkResponse({
      description: 'Lista de utilizadores retornada com sucesso.',
      type: [UserAdminResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_ALL_USERS.',
    }),
  );
