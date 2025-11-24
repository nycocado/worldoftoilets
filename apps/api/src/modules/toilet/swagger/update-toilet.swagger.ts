import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UpdateToiletRequestDto, ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerUpdateToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar toilet',
      description:
        'Atualiza dados de um toilet existente. Apenas campos fornecidos são atualizados. Requer permissão EDIT_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público UUID do toilet',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBody({
      type: UpdateToiletRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Toilet atualizado com sucesso.',
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
      description: 'Toilet foi deletado e não pode ser atualizado.',
    }),
  );
