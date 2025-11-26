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
import { CreateReportReplyRequestDto, ReportReplyResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de criar denúncia de resposta.
 */
export function ApiSwaggerCreateReportReply() {
  return applyDecorators(
    ApiOperation({
      summary: 'Denunciar uma resposta',
      description:
        'Cria uma denúncia sobre uma resposta. Requer permissão REPORT_REPLIES.',
    }),
    ApiBody({ type: CreateReportReplyRequestDto }),
    ApiCreatedResponse({
      description: 'Denúncia criada com sucesso.',
      type: ReportReplyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REPORT_REPLIES.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos.',
    }),
    ApiConflictResponse({
      description: 'Utilizador já denunciou esta resposta.',
    }),
    ApiNotFoundResponse({
      description: 'Resposta ou tipo de denúncia não encontrado.',
    }),
  );
}
