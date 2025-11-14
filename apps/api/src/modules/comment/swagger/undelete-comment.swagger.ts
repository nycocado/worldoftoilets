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

/**
 * Decorador Swagger para Recuperar Comentário Deletado (Moderação)
 *
 * @function ApiSwaggerUndeleteComment
 * @description Decorator que documenta o endpoint PUT /comment/:publicId/undelete no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 */
export const ApiSwaggerUndeleteComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Recuperar comentário deletado (moderação)',
      description:
        'Recupera comentário soft-deleted revertendo soft delete e restaurando estado VISIBLE. Usado por moderadores.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Comentário recuperado com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão UNDELETE_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
