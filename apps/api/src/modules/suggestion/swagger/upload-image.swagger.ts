import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadSuggestionImageDto } from '@modules/suggestion/dto/upload-image.dto';

/**
 * Decoradores do Swagger para o endpoint de upload de imagem de sugestão.
 *
 * @returns {MethodDecorator} Conjunto de decoradores aplicados.
 */
export function ApiUploadSuggestionImageSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload de imagem de sugestão',
      description:
        'Faz upload de uma imagem para uma sugestão pendente. Apenas o autor da sugestão pode fazer upload, e apenas sugestões com status PENDING podem ter imagens atualizadas.',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Ficheiro de imagem (JPEG, PNG ou WebP)',
      type: UploadSuggestionImageDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Imagem enviada com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Sugestão não está pendente ou ficheiro inválido/muito grande.',
    }),
    ApiResponse({
      status: 401,
      description: 'Utilizador não autenticado.',
    }),
    ApiResponse({
      status: 403,
      description: 'Utilizador não é o autor da sugestão.',
    }),
    ApiResponse({
      status: 404,
      description: 'Sugestão não encontrada.',
    }),
  );
}
