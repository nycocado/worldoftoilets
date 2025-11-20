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

export const ApiSwaggerDeleteUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Desativar utilizador (manage)',
      description:
        'Desativa a conta de um utilizador (soft delete). A conta pode ser restaurada posteriormente.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Utilizador desativado com sucesso.',
    }),
    ApiBadRequestResponse({
      description:
        'O utilizador já está desativado ou tentativa de desativar a própria conta.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DEACTIVATE_USER.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );

