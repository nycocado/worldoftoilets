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
 * Decorador Swagger para Atualizar Resposta (Moderação)
 *
 * @function ApiSwaggerUpdateReplyManage
 * @description Decorator que documenta o endpoint PATCH /reply/:publicId/manage no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerUpdateReplyManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar qualquer resposta (moderação)',
      description:
        'Atualiza texto de qualquer resposta. Não verifica propriedade - usado por moderadores.',
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
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Resposta foi deletada.',
    }),
  );
