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
import { AccessApiName, TypeExtraApiName } from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerCreateToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar toilet com imagem opcional',
      description:
        'Cria novo toilet com localização, acesso, extras e opcionalmente uma imagem. Requer permissão CREATE_TOILETS.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: [
          'access',
          'name',
          'latitude',
          'longitude',
          'address',
          'city',
          'country',
        ],
        properties: {
          access: {
            enum: Object.values(AccessApiName),
            description: 'O tipo de acesso da casa de banho',
            example: AccessApiName.PUBLIC,
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'O nome da casa de banho',
            example: 'Casa de Banho Central',
          },
          latitude: {
            type: 'number',
            format: 'double',
            description: 'A latitude da localização',
            example: 38.7223,
          },
          longitude: {
            type: 'number',
            format: 'double',
            description: 'A longitude da localização',
            example: -9.1393,
          },
          address: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'A morada completa',
            example: 'Praça do Comércio, 1',
          },
          city: {
            type: 'string',
            maxLength: 100,
            description: 'A cidade',
            example: 'Lisboa',
          },
          state: {
            type: 'string',
            maxLength: 100,
            description: 'O estado ou província (opcional)',
            example: 'Lisboa',
          },
          country: {
            type: 'string',
            maxLength: 100,
            description: 'O país',
            example: 'Portugal',
          },
          placeId: {
            type: 'string',
            maxLength: 255,
            description: 'O ID do Google Places (opcional)',
            example: 'ChIJa2s3k...',
          },
          extras: {
            type: 'array',
            items: {
              enum: Object.values(TypeExtraApiName),
            },
            description: 'A lista de recursos extra (opcional)',
            example: [TypeExtraApiName.WHEELCHAIR_ACCESSIBLE],
          },
          image: {
            type: 'string',
            format: 'binary',
            description:
              'Imagem da casa de banho (opcional, JPEG, PNG ou WebP, máx 5MB)',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Toilet criado com sucesso.',
      type: ToiletResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiForbiddenResponse({
      description: 'Utilizador não possui permissão CREATE_TOILETS.',
    }),
    ApiBadRequestResponse({
      description:
        'Dados inválidos, país não reconhecido, imagem excede 5MB ou formato não suportado.',
    }),
  );
