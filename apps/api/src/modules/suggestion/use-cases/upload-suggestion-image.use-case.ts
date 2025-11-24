import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { MinioService } from '@modules/minio';
import { ImageValidationService } from '@common/services';
import { IMAGE_VALIDATION_CONFIG } from '@common/constants/image-validation.constant';
import { SUGGESTION_EXCEPTIONS } from '@modules/suggestion/constants/exceptions.constant';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { SuggestionEntity, SuggestionStatus } from '@database/entities';
import { Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class UploadSuggestionImageUseCase {
  constructor(
    @InjectRepository(SuggestionEntity)
    private readonly entityRepository: EntityRepository<SuggestionEntity>,
    private readonly repository: SuggestionRepository,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
  ) {}

  @Transactional()
  async execute(
    publicId: string,
    file: Express.Multer.File,
  ): Promise<SuggestionResponseDto> {
    const suggestion = await this.repository.findByPublicId(publicId);

    if (!suggestion) {
      throw new NotFoundException(SUGGESTION_EXCEPTIONS.SUGGESTION_NOT_FOUND);
    }

    if (suggestion.status !== SuggestionStatus.PENDING) {
      throw new ConflictException(
        SUGGESTION_EXCEPTIONS.ONLY_PENDING_CAN_UPLOAD_IMAGE,
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

    const fileName = await this.generateUniqueFileName(extension);

    if (suggestion.photoUrl) {
      const oldFileName = this.minioService.extractFileNameFromUrl(
        suggestion.photoUrl,
        'suggestions',
      );
      if (oldFileName) {
        try {
          await this.minioService.deleteFile(oldFileName);
        } catch {
          // Ignore errors when deleting old image
        }
      }
    }

    await this.minioService.uploadFile(sanitizedBuffer, fileName, mimeType);

    const publicUrl = this.minioService.getPublicFileUrl(fileName);

    const em = this.entityRepository.getEntityManager();
    suggestion.photoUrl = publicUrl;
    await em.flush();

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }

  private async generateUniqueFileName(extension: string): Promise<string> {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const fileName = `suggestions/${uuidv4()}.${extension}`;

      const exists = await this.fileExists(fileName);
      if (!exists) {
        return fileName;
      }

      attempts++;
    }

    return `suggestions/${Date.now()}-${uuidv4()}.${extension}`;
  }

  private async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.minioService.getFile(fileName);
      return true;
    } catch {
      return false;
    }
  }
}
