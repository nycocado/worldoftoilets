import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '@modules/auth/dto';

/**
 * Decorador Swagger para Login
 *
 * @function ApiSwaggerLogin
 * @description Decorator que documenta o endpoint POST /auth/login no Swagger.
 * Inclui documentação da operação, request body, respostas sucesso e erro.
 */
export const ApiSwaggerLogin = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Realiza o login de um usuário com email e password.',
    }),
    ApiBody({
      type: LoginRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Login realizado com sucesso.',
      type: LoginResponseDto,
      headers: {
        'Set-Cookie': {
          description: 'Cookie contendo o token JWT e refresh token.',
          schema: {
            type: 'string',
            example: 'refreshToken=string; token=string;',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Credenciais inválidas ou email não verificado.',
    }),
  );
