import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '@modules/auth/dto';

export const ApiSwaggerLogin = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Realiza o login de um usuário com email e senha.',
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
