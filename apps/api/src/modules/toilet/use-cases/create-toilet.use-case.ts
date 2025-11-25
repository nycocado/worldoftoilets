import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { AccessService } from '@modules/access';
import { TypeExtraService } from '@modules/type-extra';
import { MinioService } from '@modules/minio';
import { ImageValidationService, CountryService } from '@common/services';
import { IMAGE_VALIDATION_CONFIG } from '@common/constants/image-validation.constant';
import {
  ToiletStatus,
  AccessApiName,
  TypeExtraApiName,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

/**
 * Contém a lógica de negócio para a criação de uma nova casa de banho.
 */
@Injectable()
export class CreateToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly accessService: AccessService,
    private readonly typeExtraService: TypeExtraService,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
    private readonly countryService: CountryService,
  ) {}

  /**
   * Cria e persiste uma nova casa de banho.
   *
   * @param {AccessApiName} accessApiName O tipo de acesso.
   * @param {string} name O nome da casa de banho.
   * @param {number} latitude A latitude da localização.
   * @param {number} longitude A longitude da localização.
   * @param {string} address A morada.
   * @param {string} city A cidade.
   * @param {string | undefined} state O estado/distrito.
   * @param {string} country O país.
   * @param {string | undefined} placeId O ID do Google Places.
   * @param {TypeExtraApiName[]} [extrasApiNames] A lista de recursos extra.
   * @param {Express.Multer.File} [file] A imagem da casa de banho (opcional).
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho criada.
   * @throws {BadRequestException} Se o código do país for inválido ou imagem inválida.
   */
  @Transactional()
  async execute(
    accessApiName: AccessApiName,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    placeId: string | undefined,
    extrasApiNames?: TypeExtraApiName[],
    file?: Express.Multer.File,
  ): Promise<ToiletResponseDto> {
    const finalCountryCode = this.countryService.getCountryCode(country);

    if (!finalCountryCode) {
      throw new BadRequestException(TOILET_EXCEPTIONS.INVALID_COUNTRY_CODE);
    }

    const access = await this.accessService.getAccessByApiName(accessApiName);
    const typeExtras = await this.typeExtraService.getTypeExtrasByApiNames(
      extrasApiNames || [],
    );

    const toilet = await this.repository.create(
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      finalCountryCode,
      ToiletStatus.ACTIVE,
      placeId,
      typeExtras,
    );

    if (file) {
      if (file.size > IMAGE_VALIDATION_CONFIG.MAX_FILE_SIZE) {
        throw new BadRequestException(TOILET_EXCEPTIONS.IMAGE_TOO_LARGE);
      }

      const {
        buffer: sanitizedBuffer,
        extension,
        mimeType,
      } = await this.imageValidationService.validateAndProcessImage(
        file.buffer,
      );

      const fileName = await this.minioService.generateUniqueFileName(
        'toilets',
        extension,
      );
      await this.minioService.uploadFile(sanitizedBuffer, fileName, mimeType);
      const publicUrl = this.minioService.getPublicFileUrl(fileName);

      await this.repository.updatePhotoUrl(toilet, publicUrl);
    }

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
