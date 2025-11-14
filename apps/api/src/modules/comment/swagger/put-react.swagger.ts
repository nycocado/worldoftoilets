import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CommentResponseDto } from '@modules/comment/dto';

/**
 * Decorador Swagger para Reagir a Comentário
 *
 * @function ApiSwaggerPutReact
 * @description Decorator que documenta o endpoint PUT /comment/:publicId/react no Swagger.
 * Inclui documentação da operação, parâmetros e respostas.
 * Query parameter (react) é documentado automaticamente pelo DTO.
 */
export const ApiSwaggerPutReact = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Reagir a comentário',
      description:
        'Adiciona, remove ou altera reação (like/dislike) em comentário. Comportamento idempotente: mesma reação remove, reação diferente substitui.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do comentário',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Reação processada com sucesso.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REACT_COMMENTS.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário não encontrado.',
    }),
  );
