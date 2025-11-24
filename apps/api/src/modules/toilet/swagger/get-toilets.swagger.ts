import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerGetToilets = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar toilets ativos',
      description:
        'Retorna lista de toilets ativos (status ACTIVE) com filtros opcionais de localização, acesso e extras. Suporta paginação.',
    }),
    ApiQuery({
      name: 'pageable',
      required: false,
      description: 'Ativar paginação',
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
      name: 'city',
      required: false,
      description: 'Filtrar por cidade',
    }),
    ApiQuery({
      name: 'country',
      required: false,
      description: 'Filtrar por país',
    }),
    ApiQuery({
      name: 'countryCode',
      required: false,
      description: 'Filtrar por código ISO do país',
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
      description: 'Lista de toilets ativos.',
      type: [ToiletResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_TOILETS.',
    }),
  );
