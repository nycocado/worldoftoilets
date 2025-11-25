import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PartnerSelfResponseDto } from '@modules/partner/dto';

export const ApiSwaggerGetPartnerSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter parceria própria',
      description:
        'Retorna as informações da parceria do utilizador autenticado.',
    }),
    ApiOkResponse({
      description: 'Informações da parceria retornadas com sucesso.',
      type: PartnerSelfResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não possui parceria.',
    }),
  );
