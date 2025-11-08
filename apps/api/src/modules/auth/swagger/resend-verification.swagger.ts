import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Reenvio de Email de Verificação
 *
 * @function ApiSwaggerResendVerification
 * @description Decorator que documenta o endpoint POST /auth/resend-verification no Swagger.
 * Inclui documentação da operação, query parameters e respostas de sucesso/erro.
 * Útil quando utilizador não recebeu o email original de verificação.
 */
export const ApiSwaggerResendVerification = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Resend Verification',
      description: 'Reenvia o email de verificação para o usuário.',
    }),
    ApiQuery({
      name: 'email',
      required: true,
      type: String,
      description: 'Email do usuário.',
    }),
    ApiOkResponse({
      description: 'Email de verificação reenviado com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Email não encontrado ou já verificado.',
    }),
  );
