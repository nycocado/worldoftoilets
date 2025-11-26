import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportUserResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de rejeitar denúncia de utilizador.
 */
export function ApiSwaggerRejectReportUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Rejeitar denúncia de utilizador',
      description:
        'Rejeita uma denúncia de utilizador. Requer permissão REVIEW_REPORT_USERS.',
    }),
    ApiOkResponse({
      description: 'Denúncia rejeitada com sucesso.',
      type: ReportUserResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_USERS.',
    }),
    ApiBadRequestResponse({
      description: 'A denúncia não está em status pendente.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
  );
}
