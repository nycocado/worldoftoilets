import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResetPasswordRequestDto } from '@modules/auth/dto';

export const ApiSwaggerResetPassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reset Password',
      description: 'Redefine a senha do usuário usando o token de redefinição.',
    }),
    ApiBody({
      type: ResetPasswordRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Senha redefinida com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Token inválido ou expirado.',
    }),
  );
