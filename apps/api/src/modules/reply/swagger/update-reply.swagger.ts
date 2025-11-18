import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UpdateReplyRequestDto, ReplyResponseDto } from '@modules/reply/dto';

/**
 * Decorador Swagger para Atualizar Resposta Própria
 *
 * @function ApiSwaggerUpdateReply
 * @description Decorator que documenta o endpoint PATCH /reply/:publicId no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerUpdateReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar própria resposta',
      description:
        'Atualiza texto da própria resposta. Apenas o autor pode editar.',
    }),
    ApiBody({
      type: UpdateReplyRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Resposta atualizada com sucesso.',
      type: ReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token inválido, ausente ou utilizador não é o autor.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_SELF_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Resposta foi deletada.',
    }),
  );
