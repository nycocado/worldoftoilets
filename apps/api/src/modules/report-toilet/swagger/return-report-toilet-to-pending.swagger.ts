import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReportToiletResponseDto } from '../dto';

/**
 * Documentação Swagger para retornar denúncia ao status pendente.
 */
export const ApiSwaggerReturnReportToiletToPending = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Retornar denúncia ao status pendente',
      description:
        'Retorna uma denúncia ao status pendente, removendo o revisor e data de revisão. Requer permissão REVIEW_REPORT_TOILETS.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público da denúncia.',
      type: String,
    }),
    ApiOkResponse({
      description: 'Denúncia retornada ao status pendente com sucesso.',
      type: ReportToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REVIEW_REPORT_TOILETS.',
    }),
    ApiNotFoundResponse({
      description: 'Denúncia não encontrada.',
    }),
    ApiBadRequestResponse({
      description: 'Denúncia já está pendente.',
    }),
  );
