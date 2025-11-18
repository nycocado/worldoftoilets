import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Registar Visualização de Toilet
 *
 * @function ApiSwaggerViewToilet
 * @description Decorator que documenta o endpoint PUT /toilet/:publicId/view no Swagger.
 */
export const ApiSwaggerViewToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Registar visualização de toilet',
      description:
        'Regista que um toilet foi visualizado por um utilizador. Usado para analytics. Requer permissão VIEW_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Visualização registada com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
  );
