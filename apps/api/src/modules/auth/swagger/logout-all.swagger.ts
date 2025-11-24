import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSwaggerLogoutAll = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout All',
      description:
        'Realiza o logout do usuário em todos os dispositivos, invalidando todos os refresh tokens. Token fornecido via header Authorization (Bearer token) ou cookie.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Logout realizado com sucesso em todos os dispositivos.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido ou requirido para logout.',
    }),
  );
