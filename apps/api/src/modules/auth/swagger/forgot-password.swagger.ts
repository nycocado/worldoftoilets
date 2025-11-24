import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export const ApiSwaggerForgotPassword = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Forgot Password',
      description:
        'Envia um email com instruções para redefinir a password do usuário.',
    }),
    ApiOkResponse({
      description:
        'Email de redefinição de password enviado com sucesso (se o email existir).',
    }),
  );
