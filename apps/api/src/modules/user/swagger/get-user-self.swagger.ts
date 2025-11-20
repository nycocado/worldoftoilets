import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserSelfResponseDto } from '../dto';

export const ApiSwaggerGetUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter informações do próprio utilizador',
      description:
        'Retorna as informações completas do utilizador autenticado, incluindo os seus cargos.',
    }),
    ApiOkResponse({
      description: 'Informações do utilizador retornadas com sucesso.',
      type: UserSelfResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
  );
