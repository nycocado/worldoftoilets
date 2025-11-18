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

/**
 * Decorador Swagger para Recuperar Toilet Deletado
 *
 * @function ApiSwaggerUndeleteToilet
 * @description Decorator que documenta o endpoint PUT /toilet/:publicId/manage/undelete no Swagger.
 */
export const ApiSwaggerUndeleteToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Recuperar toilet deletado',
      description:
        'Reverte soft delete de toilet, restaurando status ACTIVE. Requer permissão UNDELETE_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet recuperado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão UNDELETE_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Toilet não está deletado.',
    }),
  );
