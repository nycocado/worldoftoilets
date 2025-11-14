import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CreateCommentRequestDto,
  CommentResponseDto,
} from '@modules/comment/dto';

/**
 * Decorador Swagger para Criar Comentário
 *
 * @function ApiSwaggerCreateComment
 * @description Decorator que documenta o endpoint POST /comment no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerCreateComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar comentário',
      description:
        'Cria novo comentário em toilet com texto e avaliação (clean, paper, structure, accessibility).',
    }),
    ApiBody({
      type: CreateCommentRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Comentário criado com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão CREATE_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet ou utilizador não encontrado.',
    }),
  );
