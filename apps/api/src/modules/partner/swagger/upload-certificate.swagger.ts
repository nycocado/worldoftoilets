import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadCertificateDto } from '@modules/partner/dto/upload-certificate.dto';

/**
 * Decoradores do Swagger para o endpoint de upload de certificado de parceria.
 *
 * @returns {MethodDecorator} Conjunto de decoradores aplicados.
 */
export function ApiUploadCertificateSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload de certificado de aplicação de parceria',
      description:
        'Faz upload do documento de certificação para uma aplicação de parceria pendente. Apenas aplicações com status PENDING podem ter certificados atualizados.',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Ficheiro de certificado (PDF ou imagem)',
      type: UploadCertificateDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Certificado enviado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Aplicação não está pendente ou ficheiro inválido/muito grande.',
    }),
    ApiResponse({
      status: 401,
      description: 'Utilizador não autenticado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Aplicação de parceria não encontrada.',
    }),
  );
}
