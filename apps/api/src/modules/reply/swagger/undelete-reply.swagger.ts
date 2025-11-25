import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';

export const ApiSwaggerUndeleteReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Recuperar resposta deletada (moderação)',
      description:
        'Recupera resposta soft-deleted. Reverte soft delete e restaura estado VISIBLE.',
    }),
    ApiOkResponse({
      description: 'Resposta recuperada com sucesso.',
      type: ReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão UNDELETE_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
  );
