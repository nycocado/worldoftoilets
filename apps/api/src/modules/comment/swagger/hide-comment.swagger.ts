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
import { CommentResponseDto } from '@modules/comment/dto';

export const ApiSwaggerHideComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Ocultar comentário (moderação)',
      description:
        'Oculta comentário do público alterando estado de VISIBLE para HIDDEN sem deletar. Usado por moderadores.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Comentário ocultado com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão HIDE_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Comentário foi deletado e não pode ser ocultado.',
    }),
  );
