import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportCommentResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de rejeitar denúncia de comentário.
 */
export function ApiSwaggerRejectReportComment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Rejeitar denúncia de comentário',
      description:
        'Rejeita uma denúncia de comentário. Requer permissão REVIEW_REPORT_COMMENTS.',
    }),
    ApiOkResponse({
      description: 'Denúncia rejeitada com sucesso.',
      type: ReportCommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_COMMENTS.',
    }),
    ApiBadRequestResponse({
      description: 'A denúncia não está em status pendente.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
  );
}
