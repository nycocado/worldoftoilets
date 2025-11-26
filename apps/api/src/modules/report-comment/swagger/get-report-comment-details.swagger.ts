import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportCommentDetailResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de obter detalhes de denúncias de um comentário.
 */
export function ApiSwaggerGetReportCommentDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de denúncias de um comentário',
      description:
        'Obtém todas as denúncias de um comentário específico. Requer permissão VIEW_REPORT_COMMENTS.',
    }),
    ApiOkResponse({
      description: 'Detalhes das denúncias obtidos com sucesso.',
      type: ReportCommentDetailResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_COMMENTS.',
    }),
  );
}
