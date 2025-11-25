import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

export const ApiSwaggerGetSuggestionsManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter todas as sugestões (admin)',
      description:
        'Retorna lista de todas as sugestões do sistema. Suporta filtros e paginação. Requer permissão VIEW_SUGGEST_TOILETS.',
    }),
    ApiOkResponse({
      description: 'Lista de sugestões do sistema.',
      type: [SuggestionResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_SUGGEST_TOILETS.',
    }),
  );
