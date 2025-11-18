import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

/**
 * Decorador Swagger para Obter Toilet por ID
 *
 * @function ApiSwaggerGetToilet
 * @description Decorator que documenta o endpoint GET /toilet/:publicId no Swagger.
 */
export const ApiSwaggerGetToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter toilet por ID',
      description:
        'Retorna dados completos de um toilet pelo ID público. Inclui avaliações e extras.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet encontrado.',
      type: ToiletResponseDto,
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
