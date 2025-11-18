import { Injectable, BadRequestException } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import {
  IMAGE_VALIDATION_CONFIG,
  IMAGE_VALIDATION_MESSAGES,
} from '@common/constants';

/**
 * Serviço de Validação e Sanitização de Imagens
 *
 * @class ImageValidationService
 * @description Implementa camadas de segurança para upload de imagens:
 * - Validação de magic bytes (conteúdo real do arquivo)
 * - Validação de dimensões (prevenção de decompression bombs)
 * - Remoção de metadados EXIF maliciosos
 * - Re-encoding seguro das imagens
 *
 * @security
 * - Previne upload de arquivos não-imagem disfarçados
 * - Protege contra exploits em metadados EXIF/XMP
 * - Mitiga ataques de decompression bomb
 * - Remove dados sensíveis (GPS, câmera, etc.)
 */
@Injectable()
export class ImageValidationService {
  /**
   * Valida o tipo real do arquivo através dos magic bytes
   *
   * @async
   * @param {Buffer} buffer - Buffer do arquivo
   * @returns {Promise<string>} Extensão do arquivo validada ('jpg', 'png', 'webp')
   * @throws {BadRequestException} Se o arquivo não for uma imagem válida
   *
   * @description
   * Analisa os primeiros bytes do arquivo (magic bytes/signature) para determinar
   * o tipo real, independente da extensão ou Content-Type HTTP.
   *
   * Magic bytes conhecidos:
   * - JPEG: FF D8 FF
   * - PNG: 89 50 4E 47
   * - WebP: 52 49 46 46
   *
   * Esta validação não pode ser forjada, pois faz parte da estrutura do arquivo.
   */
  async validateImageContent(buffer: Buffer): Promise<string> {
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.UNABLE_TO_DETERMINE_FILE_TYPE,
      );
    }

    if (
      !IMAGE_VALIDATION_CONFIG.ALLOWED_MIME_TYPES.includes(fileType.mime as any)
    ) {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.INVALID_IMAGE_TYPE(fileType.mime),
      );
    }

    // Normalizar 'jpg' e 'jpeg' para 'jpeg'
    return fileType.ext === 'jpg' ? 'jpeg' : fileType.ext;
  }

  /**
   * Valida as dimensões da imagem
   *
   * @async
   * @param {Buffer} buffer - Buffer da imagem
   * @returns {Promise<{ width: number; height: number }>} Dimensões validadas
   * @throws {BadRequestException} Se as dimensões forem inválidas
   *
   * @description
   * Protege contra:
   * - Decompression bombs (imagens pequenas que expandem para gigabytes)
   * - Imagens muito pequenas (pixels demais, não utilizáveis)
   * - Consumo excessivo de memória no processamento
   */
  async validateImageDimensions(
    buffer: Buffer,
  ): Promise<{ width: number; height: number }> {
    let metadata: sharp.Metadata;

    try {
      metadata = await sharp(buffer).metadata();
    } catch {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.FAILED_TO_PROCESS_CORRUPTED,
      );
    }

    if (!metadata.width || !metadata.height) {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.UNABLE_TO_READ_DIMENSIONS,
      );
    }

    if (
      metadata.width < IMAGE_VALIDATION_CONFIG.MIN_WIDTH ||
      metadata.height < IMAGE_VALIDATION_CONFIG.MIN_HEIGHT
    ) {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.IMAGE_TOO_SMALL(
          IMAGE_VALIDATION_CONFIG.MIN_WIDTH,
          IMAGE_VALIDATION_CONFIG.MIN_HEIGHT,
        ),
      );
    }

    if (
      metadata.width > IMAGE_VALIDATION_CONFIG.MAX_WIDTH ||
      metadata.height > IMAGE_VALIDATION_CONFIG.MAX_HEIGHT
    ) {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.IMAGE_TOO_LARGE(
          IMAGE_VALIDATION_CONFIG.MAX_WIDTH,
          IMAGE_VALIDATION_CONFIG.MAX_HEIGHT,
        ),
      );
    }

    return {
      width: metadata.width,
      height: metadata.height,
    };
  }

  /**
   * Sanitiza e re-encodifica a imagem de forma segura
   *
   * @async
   * @param {Buffer} buffer - Buffer da imagem original
   * @param {string} format - Formato desejado ('jpeg', 'png', 'webp')
   * @returns {Promise<Buffer>} Buffer da imagem sanitizada
   * @throws {BadRequestException} Se falhar o processamento
   *
   * @description
   * Processo de sanitização:
   * 1. Decodifica a imagem completamente (valida integridade)
   * 2. Remove TODOS os metadados (EXIF, XMP, IPTC, ICC)
   * 3. Re-encodifica com configurações seguras
   * 4. Aplica compressão otimizada
   *
   * Protege contra:
   * - Código malicioso em metadados EXIF
   * - Exploits em parsers de imagem
   * - Steganografia (dados escondidos)
   * - Vazamento de dados sensíveis (GPS, câmera, etc.)
   */
  async sanitizeAndReencodeImage(
    buffer: Buffer,
    format: 'jpeg' | 'png' | 'webp',
  ): Promise<Buffer> {
    try {
      const sharpInstance = sharp(buffer, {
        failOn: 'error', // Falha imediatamente se houver erro
        limitInputPixels:
          IMAGE_VALIDATION_CONFIG.MAX_WIDTH *
          IMAGE_VALIDATION_CONFIG.MAX_HEIGHT *
          4, // Limite de pixels
      });

      // Configurações específicas por formato
      const formatOptions = {
        jpeg: {
          quality: 85,
          progressive: true,
          mozjpeg: true, // Compressão otimizada
        },
        png: {
          compressionLevel: 9,
          progressive: true,
          palette: true, // Otimiza palette quando possível
        },
        webp: {
          quality: 85,
          effort: 4, // Balance entre qualidade e velocidade
        },
      };

      return await sharpInstance
        .rotate() // Auto-rotaciona baseado em EXIF Orientation (antes de remover)
        .withExif({}) // Remove TODOS os metadados EXIF
        .toFormat(format, formatOptions[format])
        .toBuffer();
    } catch {
      throw new BadRequestException(
        IMAGE_VALIDATION_MESSAGES.FAILED_TO_PROCESS_INVALID,
      );
    }
  }

  /**
   * Valida e processa uma imagem completa (pipeline completo)
   *
   * @async
   * @param {Buffer} buffer - Buffer da imagem original
   * @returns {Promise<{ buffer: Buffer; extension: string; mimeType: string }>}
   * @throws {BadRequestException} Se qualquer validação falhar
   *
   * @description
   * Pipeline de segurança completo:
   * 1. Validação de magic bytes (tipo real)
   * 2. Validação de dimensões
   * 3. Sanitização e re-encoding
   *
   * Este é o método principal que deve ser usado pelos use cases.
   */
  async validateAndProcessImage(buffer: Buffer): Promise<{
    buffer: Buffer;
    extension: string;
    mimeType: string;
  }> {
    // 1. Validar tipo real do arquivo
    const extension = await this.validateImageContent(buffer);

    // 2. Validar dimensões
    await this.validateImageDimensions(buffer);

    // 3. Sanitizar e re-encodificar
    const sanitizedBuffer = await this.sanitizeAndReencodeImage(
      buffer,
      extension as 'jpeg' | 'png' | 'webp',
    );

    // 4. Determinar MIME type correto
    const mimeType = this.getMimeType(extension);

    return {
      buffer: sanitizedBuffer,
      extension,
      mimeType,
    };
  }

  /**
   * Retorna o MIME type correto para uma extensão
   *
   * @private
   * @param {string} extension - Extensão do arquivo
   * @returns {string} MIME type
   */
  private getMimeType(extension: string): string {
    return (
      IMAGE_VALIDATION_CONFIG.MIME_TYPE_MAP[
        extension as keyof typeof IMAGE_VALIDATION_CONFIG.MIME_TYPE_MAP
      ] || 'application/octet-stream'
    );
  }
}
