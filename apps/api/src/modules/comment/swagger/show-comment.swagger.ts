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
 * Decorador Swagger para Mostrar Comentário (Moderação)
 *
 * @function ApiSwaggerShowComment
 * @description Decorator que documenta o endpoint PUT /comment/:publicId/show no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 */
export const ApiSwaggerShowComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Mostrar comentário (moderação)',
      description:
        'Torna comentário visível publicamente alterando estado de HIDDEN para VISIBLE. Usado por moderadores.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Comentário tornado visível com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SHOW_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
    ApiConflictResponse({
      description: 'Comentário foi deletado e não pode ser tornado visível.',
    }),
  );
