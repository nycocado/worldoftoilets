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

export const ApiSwaggerHideReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Ocultar resposta (moderação)',
      description:
        'Oculta resposta do público sem deletar. Altera estado de VISIBLE para HIDDEN.',
    }),
    ApiOkResponse({
      description: 'Resposta ocultada com sucesso.',
      type: ReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão HIDE_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Resposta foi deletada.',
    }),
  );
