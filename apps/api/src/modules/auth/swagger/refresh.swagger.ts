import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenResponseDto } from '@modules/auth/dto';

export const ApiSwaggerRefresh = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Refresh Token',
      description:
        'Renova o token de acesso usando um refresh token válido via header Authorization (Bearer token) ou cookie.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Token de acesso renovado com sucesso.',
      type: RefreshTokenResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido ou expirado.',
    }),
  );
