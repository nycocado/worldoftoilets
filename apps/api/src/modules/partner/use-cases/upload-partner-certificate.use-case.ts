import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { MinioService } from '@modules/minio';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants/exceptions.constant';
import { PartnerApplicationResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para o upload de certificado de uma aplicação de parceria.
 */
@Injectable()
export class UploadPartnerCertificateUseCase {
  constructor(
    private readonly repository: PartnerRepository,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Faz o upload de um certificado e associa a uma aplicação de parceria.
   *
   * @param {string} publicId O ID público da aplicação de parceria.
   * @param {Express.Multer.File} file O ficheiro do certificado (PDF ou imagem).
   * @returns {Promise<PartnerApplicationResponseDto>} O DTO da aplicação atualizado.
   * @throws {NotFoundException} Se a aplicação não for encontrada.
   * @throws {BadRequestException} Se a aplicação já foi revisada ou se o ficheiro é inválido.
   */
  @Transactional()
  async execute(
    publicId: string,
    file: Express.Multer.File,
  ): Promise<PartnerApplicationResponseDto> {
    const partner = await this.repository.findByPublicId(publicId);

    if (!partner) {
      throw new NotFoundException(PARTNER_EXCEPTIONS.PARTNER_NOT_FOUND);
    }

    if (partner.status !== PartnerStatus.PENDING) {
      throw new BadRequestException(PARTNER_EXCEPTIONS.APPLICATION_NOT_PENDING);
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException(PARTNER_EXCEPTIONS.CERTIFICATE_TOO_LARGE);
    }

    const extension = file.originalname.split('.').pop() || 'pdf';
    const fileName = await this.minioService.generateUniqueFileName(
      'partner-certificates',
      extension,
    );

    if (partner.certificate) {
      const oldFileName = this.minioService.extractFileNameFromUrl(
        partner.certificate,
        'partner-certificates',
      );
      if (oldFileName) {
        await this.minioService.deleteFile(oldFileName).catch(() => {});
      }
    }

    await this.minioService.uploadFile(
      file.buffer,
      fileName,
      file.mimetype,
    );

    const publicUrl = this.minioService.getPublicFileUrl(fileName);

    await this.repository.updateCertificate(partner, publicUrl);

    return plainToInstance(PartnerApplicationResponseDto, partner, {
      excludeExtraneousValues: true,
    });
  }
}
