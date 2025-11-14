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
 * Decorador Swagger para Listar Todos Comentários de Toilet (Moderação)
 *
 * @function ApiSwaggerGetCommentsByToiletManage
 * @description Decorator que documenta o endpoint GET /comment/toilet/:publicId/manage no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 * Query parameters (pageable, page, size, commentState, timestamp) são documentados automaticamente pelo DTO.
 */
export const ApiSwaggerGetCommentsByToiletManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todos comentários de toilet (moderação)',
      description:
        'Lista TODOS os comentários de um toilet (visíveis, ocultos, deletados). Requer permissão VIEW_ALL_COMMENTS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do toilet',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Lista de comentários retornada com sucesso.',
      type: [CommentResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_ALL_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
  );
