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
import { PartnerApplicationResponseDto } from '@modules/partner/dto';

export const ApiSwaggerApplyPartner = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: 'Candidatura de parceria (público)',
      description:
        'Permite que candidatos submetam uma candidatura de parceria para uma casa de banho com certificado. Não requer autenticação.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['toiletPublicId', 'contactEmail', 'certificate'],
        properties: {
          toiletPublicId: {
            type: 'string',
            format: 'uuid',
            description: 'O ID público da casa de banho',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          contactEmail: {
            type: 'string',
            format: 'email',
            description: 'E-mail de contacto para a parceria',
            example: 'contacto@shopping-colombo.pt',
            maxLength: 100,
          },
          certificate: {
            type: 'string',
            format: 'binary',
            description:
              'Documento de certificação (PDF, JPEG, PNG ou WebP, máx 10MB)',
          },
        },
      },
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
