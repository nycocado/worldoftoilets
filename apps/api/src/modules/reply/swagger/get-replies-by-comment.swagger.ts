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

export const ApiSwaggerGetRepliesByComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar respostas de comentário',
      description:
        'Lista respostas VISÍVEIS de um comentário específico. Suporta paginação.',
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
      description: 'Utilizador não possui permissão VIEW_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
