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
import { PartnerAdminResponseDto } from '@modules/partner/dto';

export const ApiSwaggerActivatePartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Ativar parceria (manage)',
      description:
        'Reativa uma parceria que estava inativa. Requer permissão MANAGE_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Parceria ativada com sucesso.',
      type: PartnerAdminResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão MANAGE_PARTNERS.',
    }),
    ApiNotFoundResponse({
      description: 'Parceria não encontrada.',
    }),
    ApiConflictResponse({
      description: 'Parceria já está ativa.',
    }),
  );
