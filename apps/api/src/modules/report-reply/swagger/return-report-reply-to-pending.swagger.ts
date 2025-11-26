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
 * Documentação Swagger para o endpoint de retornar denúncia ao status pendente.
 */
export function ApiSwaggerReturnReportReplyToPending() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retornar denúncia ao status pendente',
      description:
        'Retorna uma denúncia de resposta ao status pendente. Requer permissão REVIEW_REPORT_REPLIES.',
    }),
    ApiOkResponse({
      description: 'Denúncia retornada ao status pendente com sucesso.',
      type: ReportReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_REPLIES.',
    }),
    ApiBadRequestResponse({
      description: 'A denúncia já está pendente.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
  );
}
