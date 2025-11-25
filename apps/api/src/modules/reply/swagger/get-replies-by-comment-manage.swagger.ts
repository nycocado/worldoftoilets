import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';

export const ApiSwaggerGetRepliesByCommentManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todas respostas de comentário (moderação)',
      description:
        'Lista TODAS as respostas de um comentário (visíveis, ocultas, deletadas). Suporta filtro por estado.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'O ID público do comentário.',
      type: 'string',
      format: 'uuid',
    }),
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
