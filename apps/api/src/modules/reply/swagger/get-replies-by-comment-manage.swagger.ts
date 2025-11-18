import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';
import { ReplyState } from '@database/entities';

/**
 * Decorador Swagger para Listar Respostas por Comentário (Moderação)
 *
 * @function ApiSwaggerGetRepliesByCommentManage
 * @description Decorator que documenta o endpoint GET /reply/comment/:publicId/manage no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 */
export const ApiSwaggerGetRepliesByCommentManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todas respostas de comentário (moderação)',
      description:
        'Lista TODAS as respostas de um comentário (visíveis, ocultas, deletadas). Suporta filtro por estado.',
    }),
    ApiQuery({ name: 'pageable', required: false, type: Boolean }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'size', required: false, type: Number }),
    ApiQuery({ name: 'replyState', required: false, enum: ReplyState }),
    ApiQuery({ name: 'timestamp', required: false, type: Date }),
    ApiOkResponse({
      description: 'Lista de respostas retornada com sucesso.',
      type: [ReplyResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_ALL_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
