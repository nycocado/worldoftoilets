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
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de Uso para Upload de Imagem de Toilet
 *
 * @class UploadToiletImageUseCase
 * @description Implementa a lógica de negócio para fazer upload de uma imagem para um toilet,
 * armazená-la no Minio e atualizar a URL da foto no toilet.
 *
 * @implements
 *   - Validação de existência e estado do toilet
 *   - Validação do tipo e tamanho do arquivo de imagem
 *   - Geração de nome de arquivo único
 *   - Deleção da imagem antiga, se existir
 *   - Upload da nova imagem para o serviço de armazenamento (Minio)
 *   - Atualização da URL da foto no toilet
 *
 * @example
 * const toilet = await uploadToiletImageUseCase.execute('toilet-public-id', file);
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet estiver deletado.
 * @throws {BadRequestException} Se o tipo de imagem for inválido ou o arquivo for muito grande.
 *
 * @see ToiletRepository
 * @see MinioService
 */
@Injectable()
export class UploadToiletImageUseCase {
  /**
   * Construtor do UploadToiletImageUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   * @param {MinioService} minioService - Serviço para interação com o Minio (armazenamento de objetos)
   * @param {ImageValidationService} imageValidationService - Serviço de validação e sanitização de imagens
   */
  constructor(
    private readonly repository: ToiletRepository,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
  ) {}

  /**
   * Executa o caso de uso para upload de imagem de um toilet.
   *
   * @async
   * @param {string} publicId - O ID público do toilet.
   * @param {Express.Multer.File} file - O arquivo de imagem a ser enviado.
   * @returns {Promise<ToiletResponseDto>} O DTO do toilet atualizado com a nova URL da imagem.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {BadRequestException} Se o tipo de arquivo não for uma imagem suportada ou se o tamanho exceder 5MB.
   *
   * @description
   * 1. Valida a existência e o estado do toilet.
   * 2. Valida o tamanho do arquivo.
   * 3. Valida e processa a imagem (magic bytes, dimensões, sanitização).
   * 4. Gera um nome de arquivo único para a nova imagem.
   * 5. Se uma imagem antiga existir, tenta deletá-la do Minio.
   * 6. Faz o upload da nova imagem sanitizada para o Minio.
   * 7. Atualiza a `photoUrl` do toilet com a URL pública da nova imagem.
   * 8. Retorna o DTO do toilet atualizado.
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

    const fileName = await this.generateUniqueFileName(extension);

    if (toilet.photoUrl) {
      const oldFileName = this.minioService.extractFileNameFromUrl(
        toilet.photoUrl,
        'toilets',
      );
      if (oldFileName) {
        try {
          await this.minioService.deleteImage(oldFileName);
        } catch {
          // Ignore errors when deleting old image
        }
      }
    }

    await this.minioService.uploadImage(sanitizedBuffer, fileName, mimeType);

    const publicUrl = this.minioService.getPublicImageUrl(fileName);

    await this.repository.updatePhotoUrl(toilet, publicUrl);

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Gera um nome de arquivo único para a imagem.
   *
   * @private
   * @async
   * @param {string} extension - A extensão do arquivo (ex: 'png').
   * @returns {Promise<string>} Um nome de arquivo único e seguro.
   *
   * @description
   * Tenta gerar um nome de arquivo baseado em UUIDv4. Se houver colisão (extremamente raro),
   * tenta novamente até 5 vezes antes de usar um fallback com timestamp.
   */
  private async generateUniqueFileName(extension: string): Promise<string> {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const fileName = `toilets/${uuidv4()}.${extension}`;

      const exists = await this.fileExists(fileName);
      if (!exists) {
        return fileName;
      }

      attempts++;
    }

    return `toilets/${Date.now()}-${uuidv4()}.${extension}`;
  }

  /**
   * Verifica se um arquivo já existe no Minio.
   *
   * @private
   * @async
   * @param {string} fileName - O nome do arquivo a ser verificado.
   * @returns {Promise<boolean>} `true` se o arquivo existir, `false` caso contrário.
   */
  private async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.minioService.getImage(fileName);
      return true;
    } catch {
      return false;
    }
  }
}
