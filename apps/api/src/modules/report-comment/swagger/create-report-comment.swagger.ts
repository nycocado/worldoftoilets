import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateReportCommentRequestDto,
  ReportCommentResponseDto,
} from '../dto';

/**
 * Documentação Swagger para o endpoint de criar denúncia de comentário.
 */
export function ApiSwaggerCreateReportComment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Denunciar um comentário',
      description:
        'Cria uma denúncia sobre um comentário. O utilizador só pode denunciar cada comentário uma vez. Requer permissão REPORT_COMMENTS.',
    }),
    ApiBody({ type: CreateReportCommentRequestDto }),
    ApiCreatedResponse({
      description: 'Denúncia criada com sucesso.',
      type: ReportCommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REPORT_COMMENTS.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos.',
    }),
    ApiConflictResponse({
      description: 'Utilizador já denunciou este comentário.',
    }),
    ApiNotFoundResponse({
      description: 'Comentário ou tipo de denúncia não encontrado.',
    }),
  );
}
