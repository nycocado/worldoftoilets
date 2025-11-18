import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateReplyRequestDto, ReplyResponseDto } from '@modules/reply/dto';

/**
 * Decorador Swagger para Criar Resposta
 *
 * @function ApiSwaggerCreateReply
 * @description Decorator que documenta o endpoint POST /reply no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerCreateReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar resposta',
      description: 'Cria nova resposta a um comentário com texto obrigatório.',
    }),
    ApiBody({
      type: CreateReplyRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Resposta criada com sucesso.',
      type: ReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão CREATE_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário ou utilizador não encontrado.',
    }),
  );
