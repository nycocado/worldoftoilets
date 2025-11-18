import { applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

/**
 * Decorador Swagger para Upload de Imagem de Sugestão
 *
 * @function ApiSwaggerUploadSuggestionImage
 * @description Decorator que documenta o endpoint POST /suggestion/:publicId/image no Swagger.
 */
export const ApiSwaggerUploadSuggestionImage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload de imagem da sugestão',
      description:
        'Faz upload de foto da sugestão. Aceita JPEG, PNG e WebP (máx 5MB). Remove foto anterior se existir. Apenas sugestões pendentes podem ter imagens carregadas. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'Arquivo de imagem (JPEG, PNG ou WebP, máx 5MB)',
          },
        },
        required: ['image'],
      },
    }),
    ApiOkResponse({
      description: 'Imagem enviada com sucesso.',
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
    ApiConflictResponse({
      description: 'Sugestão não está pendente.',
    }),
    ApiBadRequestResponse({
      description: 'Tipo de imagem inválido ou arquivo muito grande (máx 5MB).',
    }),
  );
