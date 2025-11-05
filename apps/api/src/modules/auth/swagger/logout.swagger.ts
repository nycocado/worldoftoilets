import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSwaggerLogout = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout',
      description: 'Realiza o logout do usuário, invalidando o refresh token.',
    }),
    ApiOkResponse({
      description: 'Logout realizado com sucesso.',
    }),
    ApiQuery({
      name: 'refreshToken',
      required: false,
      type: String,
      description:
        'Refresh token para renovar o token de acesso. Se não for fornecido, será usado o cookie.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido.',
    }),
  );
