import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSwaggerLogoutAll = () =>
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
