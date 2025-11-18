import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Deletar Resposta Própria
 *
 * @function ApiSwaggerDeleteReply
 * @description Decorator que documenta o endpoint DELETE /reply/:publicId no Swagger.
 * Inclui documentação da operação e respostas.
 */
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
