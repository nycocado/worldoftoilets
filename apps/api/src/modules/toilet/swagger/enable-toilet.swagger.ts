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
import { ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerEnableToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Ativar toilet',
      description:
        'Marca toilet inativo como ativo, mudando status para ACTIVE. Toilets ativos aparecem em listagens públicas. Requer permissão ENABLE_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet ativado com sucesso.',
      type: ToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão ENABLE_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Toilet já está ativo ou foi deletado.',
    }),
  );
