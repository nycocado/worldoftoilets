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

/**
 * Decorador Swagger para Ocultar Comentário (Moderação)
 *
 * @function ApiSwaggerHideComment
 * @description Decorator que documenta o endpoint PUT /comment/:publicId/hide no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 */
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
