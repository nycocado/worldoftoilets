import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

/**
 * Decorador Swagger para Recuperação de Password
 *
 * @function ApiSwaggerForgotPassword
 * @description Decorator que documenta o endpoint POST /auth/forgot-password no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 * Por segurança, retorna sucesso mesmo se email não existir.
 */
export const ApiSwaggerForgotPassword = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Forgot Password',
      description:
        'Envia um email com instruções para redefinir a password do usuário.',
    }),
    ApiQuery({
      name: 'email',
      required: true,
      type: String,
      description: 'Email do usuário.',
    }),
    ApiOkResponse({
      description:
        'Email de redefinição de password enviado com sucesso (se o email existir).',
    }),
  );
