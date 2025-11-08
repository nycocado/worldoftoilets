import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Verificação de Email
 *
 * @function ApiSwaggerVerifyEmail
 * @description Decorator que documenta o endpoint POST /auth/verify-email no Swagger.
 * Inclui documentação da operação, query parameters e respostas de sucesso/erro.
 * Token é recebido via email durante o registo.
 */
export const ApiSwaggerVerifyEmail = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Verify Email',
      description: 'Verifica o email do usuário usando o token de verificação.',
    }),
    ApiQuery({
      name: 'token',
      required: true,
      type: String,
      description: 'Token de verificação enviado por email.',
    }),
    ApiOkResponse({
      description: 'Email verificado com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Token inválido ou expirado.',
    }),
  );
