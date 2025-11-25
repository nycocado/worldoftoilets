import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApplyPartnerRequestDto,
  PartnerApplicationResponseDto,
} from '@modules/partner/dto';

export const ApiSwaggerApplyPartner = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Candidatura de parceria (público)',
      description:
        'Permite que candidatos submetam uma candidatura de parceria para uma casa de banho. Após criar a candidatura, utilize o endpoint POST /partner/:publicId/certificate para enviar o certificado. Não requer autenticação.',
    }),
    ApiBody({
      type: ApplyPartnerRequestDto,
    }),
    ApiCreatedResponse({
      description: 'Candidatura submetida com sucesso.',
      type: PartnerApplicationResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Casa de banho não encontrada.',
    }),
    ApiConflictResponse({
      description:
        'A casa de banho já possui parceiro ativo ou candidatura pendente.',
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos.',
    }),
  );
