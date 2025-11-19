import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiServiceUnavailableResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RouteResponseDto } from '../dto';

export const ApiSwaggerCalculateRouteToToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Calcular rota até um toilet',
      description:
        'Calcula a rota otimizada entre a localização do utilizador e um toilet específico utilizando o algoritmo A*.',
    }),
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do toilet de destino.',
      type: 'string',
      format: 'uuid',
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
    ApiNotFoundResponse({
      description: 'Toilet não encontrado.',
    }),
    ApiServiceUnavailableResponse({
      description: 'Serviço de rotas indisponível.',
    }),
  );
