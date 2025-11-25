import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

export const ApiSwaggerApprovePartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aprovar candidatura (manage)',
      description:
        'Aprova uma candidatura de parceria, cria conta de utilizador e envia credenciais. Requer permissão REVIEW_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Candidatura aprovada com sucesso. Utilizador criado.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_PARTNERS.',
    }),
    ApiNotFoundResponse({
      description: 'Parceria não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Candidatura não está em estado pendente.',
    }),
  );
