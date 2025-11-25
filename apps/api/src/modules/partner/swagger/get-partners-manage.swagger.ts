import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PartnerAdminResponseDto } from '@modules/partner/dto';

export const ApiSwaggerGetPartnersManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar candidaturas (manage)',
      description:
        'Lista candidaturas de parceria com filtros. Requer permissão VIEW_PARTNERS.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar por status da parceria',
      enum: ['pending', 'active', 'inactive', 'rejected'],
    }),
    ApiOkResponse({
      description: 'Lista de candidaturas retornada com sucesso.',
      type: [PartnerAdminResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_PARTNERS.',
    }),
  );
