import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { RouteResponseDto } from '../dto';

export const ApiSwaggerCalculateRoute = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Calcular rota entre dois pontos',
      description:
        'Calcula a rota otimizada entre um ponto de origem e um ponto de destino utilizando o algoritmo A*.',
    }),
    ApiOkResponse({
      description: 'Rota calculada com sucesso.',
      type: RouteResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Coordenadas inválidas ou fora da área de serviço.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão ROUTE_TOILETS.',
    }),
    ApiServiceUnavailableResponse({
      description: 'Serviço de rotas indisponível.',
    }),
  );
