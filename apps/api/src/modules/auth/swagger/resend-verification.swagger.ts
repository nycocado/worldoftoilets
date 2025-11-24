import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const ApiSwaggerResendVerification = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Resend Verification',
      description: 'Reenvia o email de verificação para o usuário.',
    }),
    ApiOkResponse({
      description: 'Email de verificação reenviado com sucesso.',
    }),
    ApiBadRequestResponse({
      description: 'Email não encontrado ou já verificado.',
    }),
  );
