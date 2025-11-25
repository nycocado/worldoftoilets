import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

export const ApiSwaggerGetSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter sugestão por ID',
      description:
        'Retorna dados completos de uma sugestão pelo ID público. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Sugestão encontrada.',
      type: SuggestionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SUGGEST_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Sugestão não encontrada.',
    }),
  );
