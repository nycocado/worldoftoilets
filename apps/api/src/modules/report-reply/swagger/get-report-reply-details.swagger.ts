import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportReplyDetailResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de obter detalhes de denúncias de uma resposta.
 */
export function ApiSwaggerGetReportReplyDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de denúncias de uma resposta',
      description:
        'Obtém todas as denúncias de uma resposta específica. Requer permissão VIEW_REPORT_REPLIES.',
    }),
    ApiOkResponse({
      description: 'Detalhes das denúncias obtidos com sucesso.',
      type: ReportReplyDetailResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_REPLIES.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta não encontrada.',
    }),
  );
}
