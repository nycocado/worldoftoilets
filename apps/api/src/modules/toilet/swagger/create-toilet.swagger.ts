import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateToiletRequestDto, ToiletResponseDto } from '@modules/toilet/dto';

export const ApiSwaggerCreateToilet = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar toilet',
      description:
        'Cria novo toilet com localização, acesso e extras. Requer permissão CREATE_TOILETS.',
    }),
    ApiBody({
      type: CreateToiletRequestDto,
      required: true,
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
      description: 'Dados inválidos ou país não reconhecido.',
    }),
  );
