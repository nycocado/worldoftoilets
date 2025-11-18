import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * Decorador Swagger para Deletar Resposta (Moderação)
 *
 * @function ApiSwaggerDeleteReplyManage
 * @description Decorator que documenta o endpoint DELETE /reply/:publicId/manage no Swagger.
 * Inclui documentação da operação e respostas.
 */
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
