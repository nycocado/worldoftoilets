import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RegisterRequestDto } from '@modules/auth/dto';

/**
 * Decorador Swagger para Registo
 *
 * @function ApiSwaggerRegister
 * @description Decorator que documenta o endpoint POST /auth/register no Swagger.
 * Inclui documentação da operação, request body, respostas sucesso e erro.
 */
export const ApiSwaggerRegister = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Register',
      description: 'Regista um novo usuário na aplicação.',
    }),
    ApiBody({
      type: RegisterRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description:
        'Registo realizado com sucesso. Verifique o seu email para ativar a conta.',
    }),
    ApiConflictResponse({
      description: 'Email já está em uso.',
    }),
  );
