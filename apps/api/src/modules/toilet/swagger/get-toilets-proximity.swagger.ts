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
 * Decorador Swagger para Obter Toilets por Proximidade
 *
 * @function ApiSwaggerGetToiletsProximity
 * @description Decorator que documenta o endpoint GET /toilet/proximity no Swagger.
 */
export const ApiSwaggerGetToiletsProximity = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter toilets por proximidade',
      description:
        'Retorna toilets ativos ordenados por distância de uma coordenada. Retorna os mais próximos primeiro.',
    }),
    ApiQuery({
      name: 'lat',
      required: true,
      type: Number,
      description: 'Latitude de referência',
    }),
    ApiQuery({
      name: 'lng',
      required: true,
      type: Number,
      description: 'Longitude de referência',
    }),
    ApiQuery({
      name: 'pageable',
      required: false,
      type: Boolean,
      description: 'Ativar paginação (default: true)',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página (começa em 0)',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: 'Tamanho da página (default: 20)',
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
      description: 'Toilets ordenados por proximidade.',
      type: [ToiletResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_TOILETS.',
    }),
  );
