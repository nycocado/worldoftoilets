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

export const ApiSwaggerRejectPartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Rejeitar candidatura (manage)',
      description:
        'Rejeita uma candidatura de parceria e notifica o candidato. Requer permissão REVIEW_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Candidatura rejeitada com sucesso.',
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
