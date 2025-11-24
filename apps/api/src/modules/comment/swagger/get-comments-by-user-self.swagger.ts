import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentResponseDto } from '@modules/comment/dto';

export const ApiSwaggerGetCommentsByUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar próprios comentários',
      description:
        'Lista comentários VISÍVEIS do utilizador autenticado. Suporta paginação e filtragem por timestamp.',
    }),
    ApiOkResponse({
      description: 'Lista de próprios comentários retornada com sucesso.',
      type: [CommentResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
  );
