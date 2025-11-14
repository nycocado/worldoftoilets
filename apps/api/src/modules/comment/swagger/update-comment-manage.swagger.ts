import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  UpdateCommentRequestDto,
  CommentResponseDto,
} from '@modules/comment/dto';

/**
 * Decorador Swagger para Atualizar Qualquer Comentário (Moderação)
 *
 * @function ApiSwaggerUpdateCommentManage
 * @description Decorator que documenta o endpoint PATCH /comment/:publicId/manage no Swagger.
 * Inclui documentação da operação, parâmetros, request body e respostas.
 */
export const ApiSwaggerUpdateCommentManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar qualquer comentário (moderação)',
      description:
        'Atualiza texto e/ou avaliação de qualquer comentário. Usado por moderadores.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiBody({
      type: UpdateCommentRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Comentário atualizado com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
