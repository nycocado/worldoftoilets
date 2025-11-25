import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiSwaggerDeletePartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Deletar parceria (manage)',
      description:
        'Remove permanentemente uma parceria. Requer permissão DELETE_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Parceria deletada com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão DELETE_PARTNERS.',
    }),
    ApiNotFoundResponse({
      description: 'Parceria não encontrada.',
    }),
  );
