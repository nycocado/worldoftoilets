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

@Injectable()
export class UpdateToiletUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly accessService: AccessService,
    private readonly typeExtraService: TypeExtraService,
    private readonly countryService: CountryService,
  ) {}

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

    if (toilet.deletedBy && toilet.deletedAt) {
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
