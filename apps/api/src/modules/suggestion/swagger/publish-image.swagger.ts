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

export const ApiSwaggerPublishSuggestionImage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Publicar imagem da sugestão aceite',
      description:
        'Copia a imagem da sugestão aceite de suggestions/ para toilets/ no armazenamento e atualiza a photoUrl da toilet. Apenas sugestões aceites com imagem podem ser publicadas. Requer permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID da sugestão',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Imagem da sugestão publicada com sucesso.',
      type: SuggestionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_SUGGEST_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Sugestão não encontrada ou não possui imagem.',
    }),
    ApiConflictResponse({
      description:
        'Sugestão não está aceite, toilet não está ativa ou formato de URL inválido.',
    }),
  );
