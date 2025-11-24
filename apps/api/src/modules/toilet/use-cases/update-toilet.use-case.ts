import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { AccessService } from '@modules/access';
import { TypeExtraService } from '@modules/type-extra';
import { CountryService } from '@common/services';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import { AccessApiName, TypeExtraApiName } from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para a atualização dos dados de uma casa de banho.
 */
@Injectable()
export class UpdateToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly accessService: AccessService,
    private readonly typeExtraService: TypeExtraService,
    private readonly countryService: CountryService,
  ) {}

  /**
   * Atualiza os dados de uma casa de banho existente.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @param {AccessApiName} [accessApiName] O novo tipo de acesso.
   * @param {string} [name] O novo nome.
   * @param {number} [latitude] A nova latitude.
   * @param {number} [longitude] A nova longitude.
   * @param {string} [address] A nova morada.
   * @param {string} [city] A nova cidade.
   * @param {string} [state] O novo estado/distrito.
   * @param {string} [country] O novo país.
   * @param {string} [placeId] O novo ID do Google Places.
   * @param {TypeExtraApiName[]} [extrasApiNames] A nova lista de recursos extra.
   * @returns {Promise<ToiletResponseDto>} O DTO da casa de banho atualizado.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   */
  async execute(
    publicId: string,
    accessApiName?: AccessApiName,
    name?: string,
    latitude?: number,
    longitude?: number,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    placeId?: string,
    extrasApiNames?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto> {
    const toilet = await this.repository.findByPublicId(publicId);

    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }

    if (toilet.isDeleted) {
      throw new ConflictException(TOILET_EXCEPTIONS.TOILET_DELETED);
    }

    const access = accessApiName
      ? await this.accessService.getAccessByApiName(accessApiName)
      : toilet.access;
    const extras = extrasApiNames
      ? await this.typeExtraService.getTypeExtrasByApiNames(extrasApiNames)
      : toilet.extras.getItems();

    const finalCountryCode = country
      ? this.countryService.getCountryCode(country)
      : undefined;

    await this.repository.update(
      toilet,
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      finalCountryCode,
      placeId,
      extras,
    );

    return plainToInstance(ToiletResponseDto, toilet, {
      excludeExtraneousValues: true,
    });
  }
}
