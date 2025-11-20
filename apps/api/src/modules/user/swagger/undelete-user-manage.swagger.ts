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

export const ApiSwaggerUndeleteUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Restaurar utilizador (manage)',
      description: 'Restaura a conta de um utilizador que foi desativado.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Utilizador restaurado com sucesso.',
      type: UserAdminResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'O utilizador não está desativado.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão ACTIVATE_USER.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
