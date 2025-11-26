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
import { CreateReportUserRequestDto, ReportUserResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de criar denúncia de utilizador.
 */
export function ApiSwaggerCreateReportUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Denunciar um utilizador',
      description:
        'Cria uma denúncia sobre um utilizador. Não é possível denunciar a si próprio. Requer permissão REPORT_USERS.',
    }),
    ApiBody({ type: CreateReportUserRequestDto }),
    ApiCreatedResponse({
      description: 'Denúncia criada com sucesso.',
      type: ReportUserResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REPORT_USERS.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos ou tentativa de denunciar a si próprio.',
    }),
    ApiConflictResponse({
      description: 'Utilizador já denunciou este utilizador com este tipo.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador ou tipo de denúncia não encontrado.',
    }),
  );
}
