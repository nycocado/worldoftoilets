import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportReplyListResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de listar respostas denunciadas.
 */
export function ApiSwaggerGetReportsReply() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar respostas denunciadas',
      description:
        'Lista as respostas que foram denunciadas, com agregações de dados. Requer permissão VIEW_REPORT_REPLIES.',
    }),
    ApiOkResponse({
      description: 'Respostas denunciadas obtidas com sucesso.',
      type: [ReportReplyListResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_REPLIES.',
    }),
    ApiBadRequestResponse({
      description: 'Parâmetros de requisição inválidos.',
    }),
  );
}
