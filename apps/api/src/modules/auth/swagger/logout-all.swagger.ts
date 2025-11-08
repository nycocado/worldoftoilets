import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Logout Global
 *
 * @function ApiSwaggerLogoutAll
 * @description Decorator que documenta o endpoint POST /auth/logout-all no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 * Efetua logout de todas as sessões do utilizador, invalidando todos os refresh tokens.
 */
export const ApiSwaggerLogoutAll = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout All',
      description:
        'Realiza o logout do usuário em todos os dispositivos, invalidando todos os refresh tokens.',
    }),
    ApiOkResponse({
      description: 'Logout realizado com sucesso em todos os dispositivos.',
    }),
    ApiQuery({
      name: 'refreshToken',
      required: false,
      type: String,
      description:
        'Refresh token para renovar o token de acesso. Se não for fornecido, será usado o cookie.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido ou requirido para logout.',
    }),
  );
