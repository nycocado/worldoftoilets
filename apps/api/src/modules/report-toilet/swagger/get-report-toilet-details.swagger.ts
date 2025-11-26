import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ReportToiletDetailResponseDto } from '../dto';

/**
 * Documentação Swagger para obter detalhes de denúncias de uma casa de banho.
 */
export const ApiSwaggerGetReportToiletDetails = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de denúncias de uma casa de banho',
      description:
        'Retorna todas as denúncias de uma casa de banho específica, incluindo breakdown por tipo. Requer permissão VIEW_REPORT_TOILETS.',
    }),
    ApiParam({
      name: 'toiletPublicId',
      description: 'ID público da casa de banho.',
      type: String,
    }),
    ApiOkResponse({
      description: 'Detalhes das denúncias obtidos com sucesso.',
      type: ReportToiletDetailResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Casa de banho não encontrada.',
    }),
  );
