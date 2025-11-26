import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportUserListResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de listar utilizadores denunciados.
 */
export function ApiSwaggerGetReportsUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar utilizadores denunciados',
      description:
        'Lista os utilizadores que foram denunciados, com agregações de dados. Requer permissão VIEW_REPORT_USERS.',
    }),
    ApiOkResponse({
      description: 'Utilizadores denunciados obtidos com sucesso.',
      type: [ReportUserListResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_USERS.',
    }),
    ApiBadRequestResponse({
      description: 'Parâmetros de requisição inválidos.',
    }),
  );
}
