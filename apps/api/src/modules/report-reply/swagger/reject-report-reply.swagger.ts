import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportReplyResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de rejeitar denúncia de resposta.
 */
export function ApiSwaggerRejectReportReply() {
  return applyDecorators(
    ApiOperation({
      summary: 'Rejeitar denúncia de resposta',
      description:
        'Rejeita uma denúncia de resposta. Requer permissão REVIEW_REPORT_REPLIES.',
    }),
    ApiOkResponse({
      description: 'Denúncia rejeitada com sucesso.',
      type: ReportReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_REPLIES.',
    }),
    ApiBadRequestResponse({
      description: 'A denúncia não está em status pendente.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
  );
}
