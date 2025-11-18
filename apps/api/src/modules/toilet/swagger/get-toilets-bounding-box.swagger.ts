import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

/**
 * Decorador Swagger para Obter Toilets por Bounding Box
 *
 * @function ApiSwaggerGetToiletsBoundingBox
 * @description Decorator que documenta o endpoint GET /toilet/bounding-box no Swagger.
 */
export const ApiSwaggerGetToiletsBoundingBox = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter toilets por área geográfica',
      description:
        'Retorna toilets ativos dentro de uma área retangular definida por coordenadas (bounding box). Útil para mapas.',
    }),
    ApiQuery({
      name: 'minLat',
      required: true,
      type: Number,
      description: 'Latitude mínima (canto sudoeste)',
    }),
    ApiQuery({
      name: 'minLng',
      required: true,
      type: Number,
      description: 'Longitude mínima (canto sudoeste)',
    }),
    ApiQuery({
      name: 'maxLat',
      required: true,
      type: Number,
      description: 'Latitude máxima (canto nordeste)',
    }),
    ApiQuery({
      name: 'maxLng',
      required: true,
      type: Number,
      description: 'Longitude máxima (canto nordeste)',
    }),
    ApiQuery({
      name: 'access',
      required: false,
      enum: ['PUBLIC', 'PRIVATE', 'CUSTOMERS_ONLY'],
      description: 'Filtrar por tipo de acesso',
    }),
    ApiQuery({
      name: 'extras',
      required: false,
      type: String,
      description: 'Filtrar por extras (CSV: WIFI,ACCESSIBLE)',
    }),
    ApiOkResponse({
      description: 'Toilets dentro da área especificada.',
      type: [ToiletResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_TOILETS.',
    }),
  );
