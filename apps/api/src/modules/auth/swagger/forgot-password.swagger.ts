import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

export const ApiSwaggerForgotPassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Forgot Password',
      description:
        'Envia um email com instruções para redefinir a senha do usuário.',
    }),
    ApiQuery({
      name: 'email',
      required: true,
      type: String,
      description: 'Email do usuário.',
    }),
    ApiOkResponse({
      description:
        'Email de redefinição de senha enviado com sucesso (se o email existir).',
    }),
  );
