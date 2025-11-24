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

export const ApiSwaggerPublishToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Publicar toilet sugerido',
      description:
        'Aprova toilet sugerido, mudando status de SUGGESTED para ACTIVE. Requer permissão PUBLISH_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet publicado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão PUBLISH_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Toilet não está em status SUGGESTED ou foi deletado.',
    }),
  );
