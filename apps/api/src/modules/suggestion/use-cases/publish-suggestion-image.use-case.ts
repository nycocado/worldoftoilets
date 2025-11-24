import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { SuggestionService } from '@modules/suggestion/suggestion.service';
import { ToiletService } from '@modules/toilet/toilet.service';
import { MinioService } from '@modules/minio';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { SuggestionStatus, ToiletStatus } from '@database/entities';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de Uso para Publicar Imagem de Sugestão
 *
 * @class PublishSuggestionImageUseCase
 * @description Implementa a lógica de negócio para copiar a imagem de uma sugestão aceite
 * para a toilet correspondente, migrando de suggestions/ para toilets/ no armazenamento.
 *
 * @implements
 *   - Validação de que a sugestão foi aceite
 *   - Validação de que a sugestão tem imagem
 *   - Validação de que a toilet está ativa
 *   - Cópia da imagem do bucket suggestions/ para toilets/
 *   - Atualização da photoUrl na toilet
 *
 * @example
 * const result = await publishSuggestionImageUseCase.execute('suggestion-public-id');
 *
 * @throws {NotFoundException} Se a sugestão não for encontrada ou não tiver imagem.
 * @throws {ConflictException} Se a sugestão não estiver aceite ou a toilet não estiver ativa.
 *
 * @see SuggestionService
 * @see ToiletService
 * @see MinioService
 */
@Injectable()
export class PublishSuggestionImageUseCase {
  constructor(
    private readonly suggestionService: SuggestionService,
    private readonly toiletService: ToiletService,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Executa o caso de uso para publicar a imagem da sugestão.
   *
   * @async
   * @transactional
   * @param {string} suggestionPublicId - O ID público da sugestão.
   * @returns {Promise<SuggestionResponseDto>} O DTO da sugestão com a imagem publicada.
   * @throws {NotFoundException} Se a sugestão não for encontrada ou não tiver imagem.
   * @throws {ConflictException} Se a sugestão não estiver aceite ou a toilet não estiver ativa.
   *
   * @description
   * 1. Busca a sugestão pelo ID público.
   * 2. Valida que a sugestão foi aceite (status ACCEPTED).
   * 3. Valida que a sugestão tem uma imagem (photoUrl não nulo).
   * 4. Valida que a toilet associada está ativa (status ACTIVE).
   * 5. Extrai o nome do arquivo da URL da sugestão.
   * 6. Gera um novo nome de arquivo para a pasta toilets/.
   * 7. Copia a imagem de suggestions/ para toilets/ no MinIO.
   * 8. Atualiza a photoUrl da toilet com a nova URL pública.
   * 9. Retorna o DTO da sugestão atualizado.
   */
  @Transactional()
  async execute(suggestionPublicId: string): Promise<SuggestionResponseDto> {
    const suggestion =
      await this.suggestionService.getSuggestionByPublicId(suggestionPublicId);

    if (suggestion.status !== SuggestionStatus.ACCEPTED) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.ONLY_ACCEPTED_CAN_PUBLISH_IMAGE,
      );
    }

    if (!suggestion.photoUrl) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NO_IMAGE);
    }

    const toilet = suggestion.toilet;

    if (!toilet || toilet.status !== ToiletStatus.ACTIVE) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.TOILET_MUST_BE_ACTIVE_TO_PUBLISH_IMAGE,
      );
    }

    const oldFileName = this.minioService.extractFileNameFromUrl(
      suggestion.photoUrl,
      'suggestions',
    );
    if (!oldFileName) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.INVALID_IMAGE_URL_FORMAT,
      );
    }

    const extension = oldFileName.split('.').pop();
    const newFileName = `toilets/${uuidv4()}.${extension}`;

    await this.minioService.copyFile(oldFileName, newFileName);

    const publicUrl = this.minioService.getPublicFileUrl(newFileName);
    await this.toiletService.updatePhotoUrl(toilet, publicUrl);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
