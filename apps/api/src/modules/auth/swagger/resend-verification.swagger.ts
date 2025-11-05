import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export const ApiSwaggerResendVerification = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Resend Verification',
      description: 'Reenvia o email de verificação para o usuário.',
    }),
    ApiQuery({
      name: 'email',
      required: true,
      type: String,
      description: 'Email do usuário.',
    }),
    ApiOkResponse({
      description: 'Email de verificação reenviado com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Email não encontrado ou já verificado.',
    }),
  );
