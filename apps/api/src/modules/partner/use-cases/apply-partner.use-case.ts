import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { PartnerRepository } from '@modules/partner/partner.repository';
import { ToiletService } from '@modules/toilet';
import { MinioService } from '@modules/minio';
import { PartnerApplicationResponseDto } from '@modules/partner/dto';
import { plainToInstance } from 'class-transformer';
import { PARTNER_EXCEPTIONS } from '@modules/partner/constants';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para a candidatura de parceria.
 */
@Injectable()
export class ApplyPartnerUseCase {
  constructor(
    private readonly repository: PartnerRepository,
    private readonly toiletService: ToiletService,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Processa a candidatura de parceria.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @param {string} contactEmail E-mail de contacto.
   * @param {Express.Multer.File} file O arquivo do certificado.
   * @returns {Promise<PartnerApplicationResponseDto>} O DTO da candidatura criada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada (lançada pelo ToiletService).
   * @throws {ConflictException} Se a casa de banho já tem parceiro ou candidatura pendente.
   */
  @Transactional()
  async execute(
    toiletPublicId: string,
    contactEmail: string,
    file: Express.Multer.File,
  ): Promise<PartnerApplicationResponseDto> {
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);

    const existingPartner =
      await this.repository.findByToiletPublicId(toiletPublicId);

    if (existingPartner) {
      if (
        existingPartner.status === PartnerStatus.ACTIVE ||
        existingPartner.status === PartnerStatus.INACTIVE
      ) {
        throw new ConflictException(
          PARTNER_EXCEPTIONS.TOILET_ALREADY_HAS_PARTNER,
        );
      }

      if (existingPartner.status === PartnerStatus.PENDING) {
        throw new ConflictException(
          PARTNER_EXCEPTIONS.TOILET_HAS_PENDING_APPLICATION,
        );
      }
    }

    const extension = file.originalname.split('.').pop() || 'bin';

    const fileName = await this.minioService.generateUniqueFileName(
      'partner-certificates',
      extension,
    );
    await this.minioService.uploadFile(file.buffer, fileName, file.mimetype);
    const certificateUrl = this.minioService.getPublicFileUrl(fileName);

    const partner = await this.repository.create(
      toilet,
      certificateUrl,
      contactEmail,
    );

    return plainToInstance(PartnerApplicationResponseDto, partner, {
      excludeExtraneousValues: true,
    });
  }
}
