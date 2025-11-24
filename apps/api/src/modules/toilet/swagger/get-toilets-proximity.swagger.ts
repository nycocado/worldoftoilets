import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

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
      description: 'Latitude de referência',
    }),
    ApiQuery({
      name: 'lng',
      required: true,
      description: 'Longitude de referência',
    }),
    ApiQuery({
      name: 'pageable',
      required: false,
      description: 'Ativar paginação (default: true)',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Número da página (começa em 0)',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      description: 'Tamanho da página (default: 20)',
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
