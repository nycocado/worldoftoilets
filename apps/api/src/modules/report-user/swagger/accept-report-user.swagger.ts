import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportUserResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de aceitar denúncia de utilizador.
 */
export const ApiSwaggerAcceptReportUser = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Aceitar denúncia de utilizador',
      description:
        'Aceita uma denúncia de utilizador e aplica a resolução (soft delete do utilizador). Requer permissão REVIEW_REPORT_USERS.',
    }),
    ApiOkResponse({
      description: 'Denúncia aceite com sucesso.',
      type: ReportUserResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_USERS.',
    }),
    ApiBadRequestResponse({
      description: 'A denúncia não está em status pendente.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
  );
