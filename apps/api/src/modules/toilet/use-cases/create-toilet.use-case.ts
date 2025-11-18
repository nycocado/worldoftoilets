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
 * Caso de Uso para Criar Toilet
 *
 * @class CreateToiletUseCase
 * @description Implementa a lógica de negócio para criar um novo toilet.
 * Valida o país, busca entidades relacionadas (acesso, extras) e persiste o novo toilet.
 *
 * @implements
 *   - Validação de código de país
 *   - Criação de um novo toilet com status ATIVO
 *   - Associação de tipo de acesso e extras
 *
 * @example
 * const toilet = await createToiletUseCase.execute(
 *   'PUBLIC',
 *   'WC da Estação',
 *   38.7, -9.1,
 *   'Rua Augusta',
 *   'Lisboa',
 *   'Lisboa',
 *   'Portugal',
 *   'place-id-123',
 *   ['WIFI', 'ACCESSIBLE']
 * );
 *
 * @throws {BadRequestException} Se o código do país for inválido.
 *
 * @see ToiletRepository
 */
@Injectable()
export class CreateToiletUseCase {
  /**
   * Construtor do CreateToiletUseCase
   *
   * @param {ToiletRepository} repository - Repositório para operações de toilet
   * @param {AccessService} accessService - Serviço para obter tipos de acesso
   * @param {TypeExtraService} typeExtraService - Serviço para obter tipos de extras
   * @param {CountryService} countryService - Serviço para validação de países
   */
  constructor(
    private readonly repository: ToiletRepository,
    private readonly accessService: AccessService,
    private readonly typeExtraService: TypeExtraService,
    private readonly countryService: CountryService,
  ) {}

  /**
   * Executa o caso de uso para criar um novo toilet.
   *
   * @async
   * @transactional
   * @param {AccessApiName} accessApiName - Nome da API para o tipo de acesso.
   * @param {string} name - Nome do toilet.
   * @param {number} latitude - Latitude do toilet.
   * @param {number} longitude - Longitude do toilet.
   * @param {string} address - Endereço do toilet.
   * @param {string} city - Cidade do toilet.
   * @param {string | undefined} state - Estado/distrito do toilet.
   * @param {string} country - País do toilet.
   * @param {string | undefined} placeId - ID do local do Google Places.
   * @param {TypeExtraApiName[]} [extrasApiNames] - Nomes da API para os extras.
   * @returns {Promise<ToiletResponseDto>} O DTO do toilet criado.
   * @throws {BadRequestException} Se o código do país for inválido.
   *
   * @description
   * 1. Valida e obtém o código do país.
   * 2. Obtém a entidade de acesso pelo nome da API.
   * 3. Obtém as entidades de extras pelos nomes da API.
   * 4. Cria um novo toilet no repositório com status ATIVO.
   * 5. Retorna o toilet criado como um DTO.
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
