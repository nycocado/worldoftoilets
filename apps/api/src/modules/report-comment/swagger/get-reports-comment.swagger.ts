import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportCommentListResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de listar comentários denunciados.
 */
export function ApiSwaggerGetReportsComment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar comentários denunciados',
      description:
        'Lista os comentários que foram denunciados, com agregações de dados. Requer permissão VIEW_REPORT_COMMENTS.',
    }),
    ApiOkResponse({
      description: 'Comentários denunciados obtidos com sucesso.',
      type: [ReportCommentListResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_COMMENTS.',
    }),
    ApiBadRequestResponse({
      description: 'Parâmetros de requisição inválidos.',
    }),
  );
}
