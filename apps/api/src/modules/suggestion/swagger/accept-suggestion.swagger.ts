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
 * Decorador Swagger para Aceitar Sugestão
 *
 * @function ApiSwaggerAcceptSuggestion
 * @description Decorator que documenta o endpoint PUT /suggestion/:publicId/manage/accept no Swagger.
 */
export const ApiSwaggerAcceptSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aceitar sugestão',
      description:
        'Aprova sugestão e cria toilet correspondente com status ACTIVE. Apenas sugestões pendentes podem ser aceites. Requer permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Sugestão aceite com sucesso.',
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
