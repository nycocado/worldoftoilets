import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiSwaggerDeleteReplyManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar qualquer resposta (moderação)',
      description:
        'Soft delete de qualquer resposta. Não verifica propriedade. Usado por moderadores.',
    }),
    ApiOkResponse({
      description: 'Resposta deletada com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
  );
