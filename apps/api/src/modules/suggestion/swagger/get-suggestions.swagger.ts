import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

export const ApiSwaggerGetSuggestions = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter sugestões do utilizador',
      description:
        'Retorna lista de sugestões criadas pelo utilizador autenticado. Suporta filtros e paginação. Requer permissão SUGGEST_TOILETS.',
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
