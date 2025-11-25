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
import {
  CreateToiletSwaggerDto,
  ToiletResponseDto,
} from '@modules/toilet/dto';

export const ApiSwaggerCreateToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar toilet com imagem opcional',
      description:
        'Cria novo toilet com localização, acesso, extras e opcionalmente uma imagem. Requer permissão CREATE_TOILETS.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateToiletSwaggerDto,
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
