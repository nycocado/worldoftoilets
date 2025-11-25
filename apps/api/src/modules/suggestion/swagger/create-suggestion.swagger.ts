import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SuggestionResponseDto } from '@modules/suggestion/dto';

/**
 * Decorador Swagger para Criar Sugestão
 *
 * @function ApiSwaggerCreateSuggestion
 * @description Decorator que documenta o endpoint POST /suggestion no Swagger.
 * Inclui documentação da operação, request body e respostas.
 */
export const ApiSwaggerCreateSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar sugestão com imagem',
      description:
        'Cria nova sugestão de toilet com localização, informações e imagem. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['latitude', 'longitude', 'toilet', 'image'],
        properties: {
          latitude: {
            type: 'number',
            format: 'double',
            description: 'Latitude da localização',
            example: 38.7139,
          },
          longitude: {
            type: 'number',
            format: 'double',
            description: 'Longitude da localização',
            example: -9.1399,
          },
          toilet: {
            type: 'object',
            description: 'Informações da casa de banho sugerida (JSON string)',
            example: JSON.stringify({
              access: 'public',
              name: 'Casa de Banho Central',
              address: 'Rua Principal, 123',
              city: 'Lisboa',
              state: 'Lisboa',
              country: 'Portugal',
              placeId: 'ChIJl7p_yNc1GQ0RoG7PI_I0',
              extras: ['accessible', 'baby-changing'],
            }),
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Imagem da casa de banho (JPEG, PNG ou WebP, máx 5MB)',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Sugestão criada com sucesso.',
      type: SuggestionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão SUGGEST_TOILETS.',
    }),
    ApiBadRequestResponse({
      description:
        'Dados inválidos, país não reconhecido, imagem excede 5MB ou formato não suportado.',
    }),
  );
