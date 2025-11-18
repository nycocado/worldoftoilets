import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReplyResponseDto } from '@modules/reply/dto';

/**
 * Decorador Swagger para Listar Próprias Respostas
 *
 * @function ApiSwaggerGetRepliesByUserSelf
 * @description Decorator que documenta o endpoint GET /reply/user/self no Swagger.
 * Inclui documentação da operação, query parameters e respostas.
 */
export const ApiSwaggerGetRepliesByUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar próprias respostas',
      description:
        'Lista respostas VISÍVEIS do próprio utilizador autenticado. Suporta paginação.',
    }),
    ApiQuery({ name: 'pageable', required: false, type: Boolean }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'size', required: false, type: Number }),
    ApiQuery({ name: 'timestamp', required: false, type: Date }),
    ApiOkResponse({
      description: 'Lista de respostas retornada com sucesso.',
      type: [ReplyResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
  );
