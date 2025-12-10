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

/**
 * Contém a lógica de negócio para a criação de uma nova sugestão.
 */
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

  /**
   * Cria e persiste uma nova sugestão de casa de banho.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {number} userLatitude A latitude do utilizador que faz a sugestão.
   * @param {number} userLongitude A longitude do utilizador que faz a sugestão.
   * @param {number} toiletLatitude A latitude da casa de banho.
   * @param {number} toiletLongitude A longitude da casa de banho.
   * @param {AccessApiName} accessApiName O tipo de acesso da casa de banho.
   * @param {string} name O nome da casa de banho.
   * @param {string} address A morada da casa de banho.
   * @param {string} city A cidade da casa de banho.
   * @param {string | undefined} state O estado/distrito da casa de banho.
   * @param {string} country O país da casa de banho.
   * @param {string | undefined} placeId O ID do Google Places.
   * @param {TypeExtraApiName[]} [extrasApiNames] A lista de extras da casa de banho.
   * @returns {Promise<SuggestionResponseDto>} O DTO da sugestão criada.
   * @throws {BadRequestException} Se o código do país for inválido.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    userLatitude: number,
    userLongitude: number,
    toiletLatitude: number,
    toiletLongitude: number,
    accessApiName: AccessApiName,
    name: string,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    placeId: string | undefined,
    extrasApiNames?: TypeExtraApiName[],
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
      toiletLatitude,
      toiletLongitude,
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
      userLatitude,
      userLongitude,
    );

    return plainToInstance(SuggestionResponseDto, suggestion, {
      excludeExtraneousValues: true,
    });
  }
}
