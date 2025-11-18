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

/**
 * Decorador Swagger para Desativar Toilet
 *
 * @function ApiSwaggerDisableToilet
 * @description Decorator que documenta o endpoint PUT /toilet/:publicId/manage/disable no Swagger.
 */
export const ApiSwaggerDisableToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Desativar toilet',
      description:
        'Marca toilet como inativo, mudando status para INACTIVE. Toilets inativos não aparecem em listagens públicas. Requer permissão DISABLE_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Toilet desativado com sucesso.',
      type: ToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DISABLE_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Toilet já está inativo ou foi deletado.',
    }),
  );
