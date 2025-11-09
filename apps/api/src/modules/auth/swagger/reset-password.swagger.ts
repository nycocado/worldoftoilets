import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResetPasswordRequestDto } from '@modules/auth/dto';

/**
 * Decorador Swagger para Reset de Password
 *
 * @function ApiSwaggerResetPassword
 * @description Decorator que documenta o endpoint POST /auth/reset-password no Swagger.
 * Inclui documentação da operação, request body e respostas de sucesso/erro.
 * Token é recebido via email após solicitar forgot-password.
 */
export const ApiSwaggerResetPassword = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Reset Password',
      description:
        'Redefine a password do usuário usando o token de redefinição.',
    }),
    ApiBody({
      type: ResetPasswordRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Password redefinida com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Token inválido ou expirado.',
    }),
  );
