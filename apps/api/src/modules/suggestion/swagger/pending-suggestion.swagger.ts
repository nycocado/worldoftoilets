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
 * Decorador Swagger para Reverter Sugestão para Pendente
 *
 * @function ApiSwaggerPendingSuggestion
 * @description Decorator que documenta o endpoint PUT /suggestion/:publicId/manage/pending no Swagger.
 */
export const ApiSwaggerPendingSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Reverter sugestão para pendente',
      description:
        'Reverte status da sugestão para PENDING e toilet correspondente para SUGGESTED. Remove dados de revisão. Requer permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Sugestão revertida para pendente com sucesso.',
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
      description: 'Sugestão já está pendente.',
    }),
  );
