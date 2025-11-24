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
import { ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerUploadToiletImage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload de imagem do toilet',
      description:
        'Faz upload de foto do toilet. Aceita JPEG, PNG e WebP (máx 5MB). Remove foto anterior se existir. Requer permissão EDIT_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
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
      type: ToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Toilet foi deletado.',
    }),
    ApiBadRequestResponse({
      description: 'Tipo de imagem inválido ou arquivo muito grande (máx 5MB).',
    }),
  );
