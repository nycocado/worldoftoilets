import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterAdminRequestDto } from '@modules/auth/dto/register-admin-request.dto';

export const ApiSwaggerRegisterAdmin = (): MethodDecorator =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Register Admin',
      description:
        'Regista um novo utilizador com roles administrativas específicas. Requer autenticação e permissão CREATE_USERS.',
    }),
    ApiBody({
      type: RegisterAdminRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description:
        'Registo de administrador realizado com sucesso. Verifique o email para ativar a conta.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão CREATE_USERS.',
    }),
    ApiConflictResponse({
      description: 'Email já está em uso.',
    }),
  );
