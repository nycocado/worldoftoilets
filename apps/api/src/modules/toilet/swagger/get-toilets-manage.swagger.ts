import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerGetToiletsManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar toilets para gestão',
      description:
        'Retorna lista de toilets com todos os status (SUGGESTED, ACTIVE, INACTIVE) com filtros opcionais. Requer permissão VIEW_ALL_TOILETS.',
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
      name: 'status',
      required: false,
      description: 'Filtrar por status (default: ACTIVE)',
    }),
    ApiQuery({
      name: 'extras',
      required: false,
      description: 'Filtrar por extras',
    }),
    ApiOkResponse({
      description: 'Lista de toilets para gestão.',
      type: [ToiletResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_ALL_TOILETS.',
    }),
  );
