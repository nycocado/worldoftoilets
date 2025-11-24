import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

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
      description: 'Latitude mínima (canto sudoeste)',
    }),
    ApiQuery({
      name: 'minLng',
      required: true,
      description: 'Longitude mínima (canto sudoeste)',
    }),
    ApiQuery({
      name: 'maxLat',
      required: true,
      description: 'Latitude máxima (canto nordeste)',
    }),
    ApiQuery({
      name: 'maxLng',
      required: true,
      description: 'Longitude máxima (canto nordeste)',
    }),
    ApiQuery({
      name: 'access',
      required: false,
      description: 'Filtrar por tipo de acesso',
    }),
    ApiQuery({
      name: 'extras',
      required: false,
      description: 'Filtrar por extras',
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
