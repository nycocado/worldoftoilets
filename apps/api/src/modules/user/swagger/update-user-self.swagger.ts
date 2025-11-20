import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserSelfResponseDto } from '../dto';

export const ApiSwaggerUpdateUserSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar informações do próprio utilizador',
      description:
        'Atualiza as informações do utilizador autenticado (nome, ícone, data de nascimento).',
    }),
    ApiOkResponse({
      description: 'Utilizador atualizado com sucesso.',
      type: UserSelfResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Dados de atualização inválidos.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
  );
