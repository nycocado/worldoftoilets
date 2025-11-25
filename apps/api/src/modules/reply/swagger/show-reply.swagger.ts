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
