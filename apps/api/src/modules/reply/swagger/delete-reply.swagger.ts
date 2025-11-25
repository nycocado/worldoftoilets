import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiSwaggerDeleteReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar própria resposta',
      description:
        'Soft delete da própria resposta. Apenas o autor pode deletar. Pode ser recuperada.',
    }),
    ApiOkResponse({
      description: 'Resposta deletada com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token inválido, ausente ou utilizador não é o autor.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_SELF_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
  );
