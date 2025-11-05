import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenResponseDto } from '@modules/auth/dto';

export const ApiSwaggerRefresh = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Refresh Token',
      description: 'Renova o token de acesso usando um refresh token válido.',
    }),
    ApiOkResponse({
      description: 'Token de acesso renovado com sucesso.',
      type: RefreshTokenResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token inválido ou expirado.',
    }),
  );
