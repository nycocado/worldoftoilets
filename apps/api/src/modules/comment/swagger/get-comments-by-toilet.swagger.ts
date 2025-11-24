import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CommentResponseDto } from '@modules/comment/dto';

export const ApiSwaggerGetCommentsByToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar comentários de toilet',
      description:
        'Lista comentários VISÍVEIS de um toilet específico. Suporta paginação e filtragem por timestamp.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do toilet',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Lista de comentários visíveis retornada com sucesso.',
      type: [CommentResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
  );
