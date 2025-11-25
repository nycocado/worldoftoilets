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
  CreateSuggestionSwaggerDto,
  SuggestionResponseDto,
} from '@modules/suggestion/dto';

export const ApiSwaggerCreateSuggestion = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar sugestão com imagem',
      description:
        'Cria nova sugestão de toilet com localização, informações e imagem. Requer permissão SUGGEST_TOILETS.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateSuggestionSwaggerDto,
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
