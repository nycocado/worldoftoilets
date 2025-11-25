import { applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApplyPartnerSwaggerDto,
  PartnerApplicationResponseDto,
} from '@modules/partner/dto';

export const ApiSwaggerApplyPartner = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Candidatura de parceria (público)',
      description:
        'Permite que candidatos submetam uma candidatura de parceria para uma casa de banho com certificado. Não requer autenticação.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: ApplyPartnerSwaggerDto,
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
      description:
        'Dados inválidos ou arquivo excede 10MB ou formato não suportado.',
    }),
  );
