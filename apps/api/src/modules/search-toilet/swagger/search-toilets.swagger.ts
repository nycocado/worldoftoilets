import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SearchToiletResponseDto } from '../dto';

export const ApiSwaggerSearchToilets = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Pesquisar casas de banho',
      description: 'Realiza uma pesquisa full-text por casas de banho.',
    }),
    ApiOkResponse({
      description: 'Pesquisa concluída com sucesso.',
      type: [SearchToiletResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SEARCH_TOILETS.',
    }),
  );
