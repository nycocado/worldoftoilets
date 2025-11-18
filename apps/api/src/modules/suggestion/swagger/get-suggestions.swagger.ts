import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { SuggestionStatus } from '@database/entities';

/**
 * Decorador Swagger para Obter Sugestões do Utilizador
 *
 * @function ApiSwaggerGetSuggestions
 * @description Decorator que documenta o endpoint GET /suggestion no Swagger.
 */
export const ApiSwaggerGetSuggestions = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter sugestões do utilizador',
      description:
        'Retorna lista de sugestões criadas pelo utilizador autenticado. Suporta filtros e paginação. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: SuggestionStatus,
      description: 'Filtrar por status (PENDING, ACCEPTED, REJECTED)',
    }),
    ApiQuery({
      name: 'pageable',
      required: false,
      type: Boolean,
      description: 'Ativar paginação',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página (zero-indexed)',
      example: 0,
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: 'Tamanho da página',
      example: 10,
    }),
    ApiOkResponse({
      description: 'Lista de sugestões do utilizador.',
      type: [SuggestionResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SUGGEST_TOILETS.',
    }),
  );
