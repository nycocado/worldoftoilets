import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { MinioService } from '@modules/minio';
import { ImageValidationService } from '@common/services';
import { IMAGE_VALIDATION_CONFIG } from '@common/constants/image-validation.constant';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para o upload de uma imagem de uma casa de banho.
 */
@Injectable()
export class UploadToiletImageUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
  ) {}

  /**
   * Faz o upload de uma imagem, associa a uma casa de banho e atualiza a sua `photoUrl`.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @param {Express.Multer.File} file O ficheiro de imagem.
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho atualizado.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   * @throws {BadRequestException} Se o ficheiro for inválido ou exceder o tamanho limite.
   */
  async execute(
    publicId: string,
    file: Express.Multer.File,
  ): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    if (file.size > IMAGE_VALIDATION_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(TOILET_EXCEPTIONS.IMAGE_TOO_LARGE);
    }

    // Validação e processamento seguro da imagem
    const {
      buffer: sanitizedBuffer,
      extension,
      mimeType,
    } = await this.imageValidationService.validateAndProcessImage(file.buffer);

    const fileName = await this.minioService.generateUniqueFileName(
      'toilets',
      extension,
    );

    if (toilet.photoUrl) {
      const oldFileName = this.minioService.extractFileNameFromUrl(
        toilet.photoUrl,
        'toilets',
      );
      if (oldFileName) {
        await this.minioService.deleteFile(oldFileName).catch(() => {});
      }
    }

    await this.minioService.uploadFile(sanitizedBuffer, fileName, mimeType);

    const publicUrl = this.minioService.getPublicFileUrl(fileName);

    await this.repository.updatePhotoUrl(toilet, publicUrl);

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
