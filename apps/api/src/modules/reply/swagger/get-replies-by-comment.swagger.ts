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

/**
 * Decorador Swagger para Listar Respostas por Comentário
 *
 * @function ApiSwaggerGetRepliesByComment
 * @description Decorator que documenta o endpoint GET /reply/comment/:publicId no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 */
export const ApiSwaggerGetRepliesByComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar respostas de comentário',
      description:
        'Lista respostas VISÍVEIS de um comentário específico. Suporta paginação.',
    }),
    ApiQuery({ name: 'pageable', required: false, type: Boolean }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'size', required: false, type: Number }),
    ApiQuery({ name: 'timestamp', required: false, type: Date }),
    ApiOkResponse({
      description: 'Lista de respostas retornada com sucesso.',
      type: [ReplyResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
