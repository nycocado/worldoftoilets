import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  CreateSuggestionRequestDto,
  SuggestionResponseDto,
} from '@modules/suggestion/dto';

/**
 * Decorador Swagger para Criar Sugestão
 *
 * @function ApiSwaggerCreateSuggestion
 * @description Decorator que documenta o endpoint POST /suggestion no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerCreateSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar sugestão',
      description:
        'Cria nova sugestão de toilet com localização e informações. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiBody({
      type: CreateSuggestionRequestDto,
      required: true,
    }),
    ApiCreatedResponse({
      description: 'Sugestão criada com sucesso.',
      type: SuggestionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SUGGEST_TOILETS.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos ou país não reconhecido.',
    }),
  );
