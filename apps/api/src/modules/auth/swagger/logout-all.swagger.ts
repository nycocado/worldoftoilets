import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Logout Global
 *
 * @function ApiSwaggerLogoutAll
 * @description Decorator que documenta o endpoint POST /auth/logout-all no Swagger.
 * Inclui documentação da operação, autenticação via Bearer token e respostas.
 * Efetua logout de todas as sessões do utilizador, invalidando todos os refresh tokens.
 */
export const ApiSwaggerLogoutAll = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout All',
      description:
        'Realiza o logout do usuário em todos os dispositivos, invalidando todos os refresh tokens. Token fornecido via header Authorization (Bearer token) ou cookie.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Logout realizado com sucesso em todos os dispositivos.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido ou requirido para logout.',
    }),
  );
