import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportUserDetailResponseDto } from '../dto';

/**
 * Documentação Swagger para o endpoint de obter detalhes de denúncias de um utilizador.
 */
export function ApiSwaggerGetReportUserDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de denúncias de um utilizador',
      description:
        'Obtém todas as denúncias de um utilizador específico. Requer permissão VIEW_REPORT_USERS.',
    }),
    ApiOkResponse({
      description: 'Detalhes das denúncias obtidos com sucesso.',
      type: ReportUserDetailResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_USERS.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não encontrado.',
    }),
  );
}
