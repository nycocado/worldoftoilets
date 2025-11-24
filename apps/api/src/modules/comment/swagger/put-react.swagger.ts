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
