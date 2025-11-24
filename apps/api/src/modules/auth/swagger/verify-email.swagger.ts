import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSwaggerVerifyEmail = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Verify Email',
      description:
        'Verifica o email do usuário usando o token de verificação no header Authorization.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Email verificado com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Token inválido ou expirado.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token não fornecido.',
    }),
  );
