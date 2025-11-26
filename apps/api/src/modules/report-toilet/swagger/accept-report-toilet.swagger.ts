import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReportToiletResponseDto } from '../dto';

/**
 * Documentação Swagger para aceitar uma denúncia de casa de banho.
 */
export const ApiSwaggerAcceptReportToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aceitar denúncia',
      description:
        'Aceita uma denúncia e aplica a resolução (soft delete da casa de banho). Requer permissão REVIEW_REPORT_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público da denúncia.',
      type: String,
    }),
    ApiOkResponse({
      description: 'Denúncia aceite com sucesso.',
      type: ReportToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
    ApiBadRequestResponse({
      description: 'Denúncia não está pendente.',
    }),
  );
