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
 * Caso de Uso para Atualizar um Toilet
 *
 * @class UpdateToiletUseCase
 * @description Implementa a lógica de negócio para atualizar os dados de um toilet existente.
 *
 * @implements
 *   - Validação de existência do toilet
 *   - Prevenção de atualização em toilets deletados
 *   - Atualização parcial dos campos do toilet
 *   - Validação de código de país, se o país for alterado
 *
 * @example
 * const toilet = await updateToiletUseCase.execute(
 *   'toilet-public-id',
 *   'PRIVATE',
 *   'Novo Nome',
 *   // ... outros campos
 * );
 *
 * @throws {NotFoundException} Se o toilet não for encontrado.
 * @throws {ConflictException} Se o toilet estiver deletado.
 *
 * @see ToiletRepository
 * @see AccessService
 * @see TypeExtraService
 * @see CountryService
 */
@Injectable()
export class UpdateToiletUseCase {
  /**
   * Construtor do UpdateToiletUseCase
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
   * Executa o caso de uso para atualizar um toilet.
   *
   * @async
   * @param {string} publicId - O ID público do toilet a ser atualizado.
   * @param {AccessApiName} [accessApiName] - O novo nome da API para o tipo de acesso (opcional).
   * @param {string} [name] - O novo nome do toilet (opcional).
   * @param {number} [latitude] - A nova latitude do toilet (opcional).
   * @param {number} [longitude] - A nova longitude do toilet (opcional).
   * @param {string} [address] - O novo endereço do toilet (opcional).
   * @param {string} [city] - A nova cidade do toilet (opcional).
   * @param {string} [state] - O novo estado/distrito do toilet (opcional).
   * @param {string} [country] - O novo país do toilet (opcional).
   * @param {string} [placeId] - O novo ID do local do Google Places (opcional).
   * @param {TypeExtraApiName[]} [extrasApiNames] - A nova lista de nomes da API para os extras (opcional).
   * @returns {Promise<ToiletResponseDto>} O DTO do toilet atualizado.
   * @throws {NotFoundException} Se o toilet com o ID fornecido não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   *
   * @description
   * 1. Busca o toilet pelo ID público.
   * 2. Lança uma exceção se o toilet não for encontrado ou estiver deletado.
   * 3. Obtém as novas entidades de acesso e extras, se fornecidas.
   * 4. Valida o novo código de país, se o país for alterado.
   * 5. Chama o método do repositório para atualizar os campos do toilet.
   * 6. Retorna o toilet atualizado como um DTO.
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
