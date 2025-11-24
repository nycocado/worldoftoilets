import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSwaggerLogout = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout',
      description: 'Realiza o logout do usuário, invalidando o refresh token.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Logout realizado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido.',
    }),
  );
