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

export const ApiSwaggerDeleteToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar toilet (soft delete)',
      description:
        'Marca toilet como deletado (soft delete). Status muda para INACTIVE. Requer permissão DELETE_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet deletado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description:
        'Toilet já está deletado ou não pode ser deletado (SUGGESTED).',
    }),
  );
