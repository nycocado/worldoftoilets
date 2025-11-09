import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
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
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Logout realizado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido.',
    }),
  );
