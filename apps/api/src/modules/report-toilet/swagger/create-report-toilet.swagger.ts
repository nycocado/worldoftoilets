import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateReportToiletRequestDto, ReportToiletResponseDto } from '../dto';

/**
 * Documentação Swagger para criação de denúncia de casa de banho.
 */
export const ApiSwaggerCreateReportToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Denunciar uma casa de banho',
      description:
        'Cria uma denúncia sobre uma casa de banho. O utilizador só pode denunciar cada casa de banho uma vez. Requer permissão REPORT_TOILETS.',
    }),
    ApiBody({ type: CreateReportToiletRequestDto }),
    ApiCreatedResponse({
      description: 'Denúncia criada com sucesso.',
      type: ReportToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão REPORT_TOILETS.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos.',
    }),
    ApiConflictResponse({
      description: 'Utilizador já denunciou esta casa de banho.',
    }),
    ApiNotFoundResponse({
      description: 'Casa de banho ou tipo de denúncia não encontrado.',
    }),
  );
