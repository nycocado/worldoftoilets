import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ReportToiletListResponseDto } from '../dto';
import { ReportToiletStatus } from '@database/entities';

/**
 * Documentação Swagger para listagem de casas de banho denunciadas.
 */
export const ApiSwaggerGetReportsToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar casas de banho denunciadas',
      description:
        'Retorna lista de casas de banho com denúncias, incluindo contagem total e tipo mais frequente. Requer permissão VIEW_REPORT_TOILETS.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ReportToiletStatus,
      description: 'Filtrar por status da denúncia.',
    }),
    ApiQuery({
      name: 'pageable',
      required: false,
      type: Boolean,
      description: 'Ativar paginação.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página.',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: 'Tamanho da página.',
    }),
    ApiOkResponse({
      description: 'Lista de casas de banho denunciadas.',
      type: [ReportToiletListResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão VIEW_REPORT_TOILETS.',
    }),
  );
