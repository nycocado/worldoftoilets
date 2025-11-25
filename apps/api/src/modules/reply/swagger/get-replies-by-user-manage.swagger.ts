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

export const ApiSwaggerGetRepliesByUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar respostas de utilizador (moderação)',
      description:
        'Lista TODAS as respostas de um utilizador específico. Suporta filtro por estado.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'O ID público do utilizador.',
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
      description: 'Utilizador não encontrado.',
    }),
  );
