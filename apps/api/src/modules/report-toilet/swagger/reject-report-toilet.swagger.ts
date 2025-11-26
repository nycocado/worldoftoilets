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
 * Documentação Swagger para rejeitar uma denúncia de casa de banho.
 */
export const ApiSwaggerRejectReportToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Rejeitar denúncia',
      description:
        'Rejeita uma denúncia. Nenhuma ação é tomada sobre a casa de banho. Requer permissão REVIEW_REPORT_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público da denúncia.',
      type: String,
    }),
    ApiOkResponse({
      description: 'Denúncia rejeitada com sucesso.',
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
