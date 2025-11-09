import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenResponseDto } from '@modules/auth/dto';

/**
 * Decorador Swagger para Renovação de Token
 *
 * @function ApiSwaggerRefresh
 * @description Decorator que documenta o endpoint POST /auth/refresh no Swagger.
 * Inclui documentação da operação, respostas sucesso e erro.
 * Refresh token é obtido de cookie ou header Authorization com Bearer token.
 */
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
