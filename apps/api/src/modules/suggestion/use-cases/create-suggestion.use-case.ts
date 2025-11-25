import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import {
  InteractionDiscriminator,
  AccessApiName,
  TypeExtraApiName,
  ToiletStatus,
  SuggestionEntity,
} from '@database/entities';
import { SuggestionResponseDto } from '@modules/suggestion/dto';
import { SuggestionRepository } from '@modules/suggestion/suggestion.repository';
import { plainToInstance } from 'class-transformer';
import { InteractionService } from '@modules/interaction';
import { UserService } from '@modules/user';
import { AccessService } from '@modules/access';
import { TypeExtraService } from '@modules/type-extra';
import { ToiletService } from '@modules/toilet';
import { MinioService } from '@modules/minio';
import { ImageValidationService } from '@common/services';
import { CountryService } from '@common/services';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';

@Injectable()
export class CreateSuggestionUseCase {
  constructor(
    @InjectRepository(SuggestionEntity)
    private readonly entityRepository: EntityRepository<SuggestionEntity>,
    private readonly repository: SuggestionRepository,
    private readonly toiletService: ToiletService,
    private readonly interactionService: InteractionService,
    private readonly userService: UserService,
    private readonly accessService: AccessService,
    private readonly typeExtraService: TypeExtraService,
    private readonly minioService: MinioService,
    private readonly imageValidationService: ImageValidationService,
    private readonly countryService: CountryService,
  ) {}

  @Transactional()
  async execute(
    userPublicId: string,
    latitude: number,
    longitude: number,
    accessApiName: AccessApiName,
    name: string,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    placeId: string | undefined,
    extrasApiNames?: TypeExtraApiName[],
    file?: Express.Multer.File,
  ): Promise<SuggestionResponseDto> {
    const finalCountryCode = this.countryService.getCountryCode(country);

    if (!finalCountryCode) {
      throw new BadRequestException(TOILET_EXCEPTIONS.INVALID_COUNTRY_CODE);
    }

    const user = await this.userService.getUserByPublicId(userPublicId);
    const access = await this.accessService.getAccessByApiName(accessApiName);
    const typeExtras = await this.typeExtraService.getTypeExtrasByApiNames(
      extrasApiNames || [],
    );

    const toilet = await this.toiletService.createToilet(
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      finalCountryCode,
      ToiletStatus.SUGGESTED,
      placeId,
      typeExtras,
    );

    const interaction = await this.interactionService.createInteraction(
      user,
      toilet,
      InteractionDiscriminator.SUGGESTION,
    );

    const suggestion = await this.repository.create(
      interaction,
      latitude,
      longitude,
    );

    if (file) {
      const {
        buffer: sanitizedBuffer,
        extension,
        mimeType,
      } = await this.imageValidationService.validateAndProcessImage(
        file.buffer,
      );

      const fileName = await this.minioService.generateUniqueFileName(
        'suggestions',
        extension,
      );
      await this.minioService.uploadFile(sanitizedBuffer, fileName, mimeType);
      const publicUrl = this.minioService.getPublicFileUrl(fileName);

      const em = this.entityRepository.getEntityManager();
      suggestion.photoUrl = publicUrl;
      await em.flush();
    }

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
