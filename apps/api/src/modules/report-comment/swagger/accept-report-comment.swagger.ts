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
 * Documentação Swagger para o endpoint de aceitar denúncia de comentário.
 */
export const ApiSwaggerAcceptReportComment = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aceitar denúncia de comentário',
      description:
        'Aceita uma denúncia de comentário e aplica a resolução (soft delete do comentário). Requer permissão REVIEW_REPORT_COMMENTS.',
    }),
    ApiOkResponse({
      description: 'Denúncia aceite com sucesso.',
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
