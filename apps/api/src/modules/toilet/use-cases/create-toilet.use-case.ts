import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { AccessService } from '@modules/access';
import { TypeExtraService } from '@modules/type-extra';
import { CountryService } from '@common/services';
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
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho criada.
   * @throws {BadRequestException} Se o código do país for inválido.
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

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
