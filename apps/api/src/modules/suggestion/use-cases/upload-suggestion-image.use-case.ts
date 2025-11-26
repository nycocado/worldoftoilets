import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { MinioService } from '@modules/minio';
import { ImageValidationService } from '@common/services';
import { IMAGE_VALIDATION_CONFIG } from '@common/constants/image-validation.constant';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';
import { SuggestionStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para o upload de uma imagem de uma sugestão.
 */
@Injectable()
export class UploadSuggestionImageUseCase {
  constructor(
    private readonly repository: SuggestionRepository,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
  ) {}

  /**
   * Faz o upload de uma imagem e associa a uma sugestão.
   *
   * @param {string} publicId O ID público da sugestão.
   * @param {string} userId O ID do utilizador que está a fazer o upload.
   * @param {Express.Multer.File} file O ficheiro de imagem.
   * @returns {Promise<SuggestionResponseDto>} O DTO da sugestão atualizado.
   * @throws {NotFoundException} Se a sugestão não for encontrada.
   * @throws {ForbiddenException} Se o utilizador não for o autor da sugestão.
   * @throws {BadRequestException} Se a sugestão não estiver pendente ou se o ficheiro for inválido.
   */
  @Transactional()
  async execute(
    publicId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<SuggestionResponseDto> {
    const suggestion = await this.repository.findByPublicId(publicId);

    if (!suggestion) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NOT_FOUND);
    }

    if (suggestion.interaction.user.publicId !== userId) {
      throw new ForbiddenException(SUGGESTION_EXCEPTIONS.NOT_SUGGESTION_AUTHOR);
    }

    if (suggestion.status !== SuggestionStatus.PENDING) {
      throw new BadRequestException(
        SUGGESTION_EXCEPTIONS.CANNOT_UPDATE_REVIEWED_SUGGESTION,
      );
    }

    if (file.size > IMAGE_VALIDATION_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(SUGGESTION_EXCEPTIONS.IMAGE_TOO_LARGE);
    }

    // Validação e processamento seguro da imagem
    const {
      buffer: sanitizedBuffer,
      extension,
      mimeType,
    } = await this.imageValidationService.validateAndProcessImage(file.buffer);

    const fileName = await this.minioService.generateUniqueFileName(
      'suggestions',
      extension,
    );

    if (suggestion.photoUrl) {
      const oldFileName = this.minioService.extractFileNameFromUrl(
        suggestion.photoUrl,
        'suggestions',
      );
      if (oldFileName) {
        await this.minioService.deleteFile(oldFileName).catch(() => {});
      }
    }

    await this.minioService.uploadFile(sanitizedBuffer, fileName, mimeType);

    const publicUrl = this.minioService.getPublicFileUrl(fileName);

    await this.repository.updatePhotoUrl(suggestion, publicUrl);

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
