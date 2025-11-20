import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserAdminResponseDto } from '../dto';

export const ApiSwaggerGetUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter utilizador por ID',
      description:
        'Retorna as informações detalhadas de um utilizador específico.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Informações do utilizador retornadas com sucesso.',
      type: UserAdminResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_USERS.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
