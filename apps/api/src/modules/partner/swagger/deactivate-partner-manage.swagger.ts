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

export const ApiSwaggerDeactivatePartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Desativar parceria (manage)',
      description:
        'Desativa uma parceria ativa. Requer permissão MANAGE_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Parceria desativada com sucesso.',
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
      description: 'Parceria já está inativa.',
    }),
  );
