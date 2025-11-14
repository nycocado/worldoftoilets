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
 * Decorador Swagger para Atualizar Próprio Comentário
 *
 * @function ApiSwaggerUpdateComment
 * @description Decorator que documenta o endpoint PATCH /comment/:publicId no Swagger.
 * Inclui documentação da operação, parâmetros, request body e respostas.
 */
export const ApiSwaggerUpdateComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar próprio comentário',
      description:
        'Atualiza texto e/ou avaliação do próprio comentário. Apenas o autor pode editar.',
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
      description:
        'Token de autenticação inválido, ausente ou utilizador não é o autor.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_SELF_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
