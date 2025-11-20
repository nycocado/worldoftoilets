import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export const ApiSwaggerDeleteUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Desativar própria conta',
      description:
        'Desativa a conta do utilizador autenticado (soft delete). Requer confirmação de senha. A conta pode ser restaurada por um administrador.',
    }),
    ApiOkResponse({
      description: 'Conta desativada com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'A conta já está desativada.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido, ausente ou senha incorreta.',
    }),
  );
