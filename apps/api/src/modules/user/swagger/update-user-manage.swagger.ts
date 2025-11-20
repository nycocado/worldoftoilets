import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserAdminResponseDto } from '../dto';

export const ApiSwaggerUpdateUserManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar utilizador',
      description:
        'Atualiza as informações de um utilizador específico (nome, ícone, data de nascimento).',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do utilizador.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Utilizador atualizado com sucesso.',
      type: UserAdminResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Dados de atualização inválidos.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão EDIT_USERS.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
