import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Deletar Qualquer Comentário (Moderação)
 *
 * @function ApiSwaggerDeleteCommentManage
 * @description Decorator que documenta o endpoint DELETE /comment/:publicId/manage no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 */
export const ApiSwaggerDeleteCommentManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar qualquer comentário (moderação)',
      description:
        'Soft delete de qualquer comentário. Usado por moderadores. Pode ser recuperado antes de expirar.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Comentário deletado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
