import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';

export const ApiSwaggerGetRepliesByUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar próprias respostas',
      description:
        'Lista respostas VISÍVEIS do próprio utilizador autenticado. Suporta paginação.',
    }),
    ApiOkResponse({
      description: 'Lista de respostas retornada com sucesso.',
      type: [ReplyResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
  );
