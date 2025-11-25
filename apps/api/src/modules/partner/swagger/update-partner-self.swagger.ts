import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  UpdatePartnerRequestDto,
  PartnerSelfResponseDto,
} from '@modules/partner/dto';

export const ApiSwaggerUpdatePartnerSelf = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar parceria própria',
      description:
        'Permite ao parceiro atualizar as informações de contacto da parceria.',
    }),
    ApiBody({
      type: UpdatePartnerRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Informações da parceria atualizadas com sucesso.',
      type: PartnerSelfResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente.',
    }),
    ApiNotFoundResponse({
      description: 'Utilizador não possui parceria.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos.',
    }),
  );
