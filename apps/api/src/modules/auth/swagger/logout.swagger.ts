import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Logout
 *
 * @function ApiSwaggerLogout
 * @description Decorator que documenta o endpoint POST /auth/logout no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 * Efetua logout de uma sessão específica, mantendo outras sessões ativas.
 */
export const ApiSwaggerLogout = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout',
      description: 'Realiza o logout do usuário, invalidando o refresh token.',
    }),
    ApiOkResponse({
      description: 'Logout realizado com sucesso.',
    }),
    ApiQuery({
      name: 'refreshToken',
      required: false,
      type: String,
      description:
        'Refresh token para renovar o token de acesso. Se não for fornecido, será usado o cookie.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido.',
    }),
  );
