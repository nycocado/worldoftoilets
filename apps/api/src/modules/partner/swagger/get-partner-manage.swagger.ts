import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PartnerAdminResponseDto } from '@modules/partner/dto';

export const ApiSwaggerGetPartnerManage = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter candidatura (manage)',
      description:
        'Retorna os detalhes completos de uma candidatura de parceria. Requer permissão VIEW_PARTNERS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público da parceria.',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Detalhes da candidatura retornados com sucesso.',
      type: PartnerAdminResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_PARTNERS.',
    }),
    ApiNotFoundResponse({
      description: 'Parceria não encontrada.',
    }),
  );
