import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Deletar Próprio Comentário
 *
 * @function ApiSwaggerDeleteComment
 * @description Decorator que documenta o endpoint DELETE /comment/:publicId no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 */
export const ApiSwaggerDeleteComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar próprio comentário',
      description:
        'Soft delete do próprio comentário. Apenas o autor pode deletar. Pode ser recuperado antes de expirar.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Comentário deletado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description:
        'Token de autenticação inválido, ausente ou utilizador não é o autor.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_SELF_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
