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
 * Documentação Swagger para o endpoint de aceitar denúncia de resposta.
 */
export const ApiSwaggerAcceptReportReply = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aceitar denúncia de resposta',
      description:
        'Aceita uma denúncia de resposta e aplica a resolução (soft delete da resposta). Requer permissão REVIEW_REPORT_REPLIES.',
    }),
    ApiOkResponse({
      description: 'Denúncia aceite com sucesso.',
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
