import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';

/**
 * Decorador Swagger para Mostrar Resposta (Moderação)
 *
 * @function ApiSwaggerShowReply
 * @description Decorator que documenta o endpoint PUT /reply/:publicId/manage/show no Swagger.
 * Inclui documentação da operação e respostas.
 */
export const ApiSwaggerShowReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Mostrar resposta (moderação)',
      description:
        'Torna resposta visível publicamente. Altera estado de HIDDEN para VISIBLE.',
    }),
    ApiOkResponse({
      description: 'Resposta tornada visível com sucesso.',
      type: ReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SHOW_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Resposta foi deletada.',
    }),
  );
