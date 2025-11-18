import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

/**
 * Decorador Swagger para Rejeitar Sugestão
 *
 * @function ApiSwaggerRejectSuggestion
 * @description Decorator que documenta o endpoint PUT /suggestion/:publicId/manage/reject no Swagger.
 */
export const ApiSwaggerRejectSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Rejeitar sugestão',
      description:
        'Rejeita sugestão e marca toilet correspondente como REJECTED. Apenas sugestões pendentes podem ser rejeitadas. Requer permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Sugestão rejeitada com sucesso.',
      type: SuggestionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Sugestão não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Sugestão não está pendente.',
    }),
  );
