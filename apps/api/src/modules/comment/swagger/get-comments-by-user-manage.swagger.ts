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

export const ApiSwaggerGetCommentsByUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar comentários de utilizador (moderação)',
      description:
        'Lista TODOS os comentários de um utilizador específico. Requer permissão VIEW_ALL_COMMENTS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Lista de comentários do utilizador retornada com sucesso.',
      type: [CommentResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_ALL_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
