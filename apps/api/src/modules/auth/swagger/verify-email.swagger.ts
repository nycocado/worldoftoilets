import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export const ApiSwaggerVerifyEmail = () =>
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
