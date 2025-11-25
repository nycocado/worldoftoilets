import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  AccessApiName,
  AccessEntity,
  InteractionDiscriminator,
  ToiletEntity,
  ToiletStatus,
  TypeExtraApiName,
  TypeExtraEntity,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

/**
 * Gerencia o acesso e a persistência de dados para a entidade Toilet.
 */
@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly repository: EntityRepository<ToiletEntity>,
  ) {}

  /**
   * Busca uma casa de banho pelo seu ID público.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @returns {Promise<ToiletEntity | null>} A entidade da casa de banho ou `null` se não for encontrada.
   */
  async findByPublicId(publicId: string): Promise<ToiletEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: [
          'access',
          'extras',
          'partner',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
      },
    );
  }

  /**
   * Busca casas de banho com base em vários filtros.
   *
   * @param {string} [city] Filtra por cidade.
   * @param {string} [country] Filtra por país.
   * @param {string} [countryCode] Filtra por código do país.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {TypeExtraApiName[]} [extras] Filtra por recursos extra.
   * @param {UserEntity} [user] O utilizador autenticado, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho.
   */
  async find(
    city?: string,
    country?: string,
    countryCode?: string,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    extras?: TypeExtraApiName[],
    user?: UserEntity,
  ): Promise<ToiletEntity[]> {
    return this.repository.find(
      {
        ...(city && { city }),
        ...(country && { country }),
        ...(countryCode && { countryCode }),
        ...(access && { access: { apiName: access } }),
        ...(status && { status }),
        ...(timestamp && { updatedAt: { $lte: timestamp } }),
        ...(extras &&
          extras.length > 0 && {
            extras: {
              $some: {
                apiName: { $in: Array.isArray(extras) ? extras : [extras] },
              },
            },
          }),
        ...(user && {
          interactions: {
            $none: {
              user: user,
              discriminator: InteractionDiscriminator.REPORT,
              deletedAt: null,
            },
          },
        }),
      },
      {
        populate: [
          'access',
          'extras',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
        ...(pageable &&
          page !== undefined &&
          size !== undefined && {
            limit: size,
            offset: page * size,
          }),
      },
    );
  }

  /**
   * Busca casas de banho dentro de uma área geográfica retangular.
   *
   * @param {number} minLat A latitude mínima.
   * @param {number} minLng A longitude mínima.
   * @param {number} maxLat A latitude máxima.
   * @param {number} maxLng A longitude máxima.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {TypeExtraApiName[]} [extras] Filtra por recursos extra.
   * @param {UserEntity} [user] O utilizador autenticado, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho na área.
   */
  async findByBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    extras?: TypeExtraApiName[],
    user?: UserEntity,
  ): Promise<ToiletEntity[]> {
    return this.repository.find(
      {
        latitude: { $gte: minLat, $lte: maxLat },
        longitude: { $gte: minLng, $lte: maxLng },
        ...(access && { access: { apiName: access } }),
        ...(status && { status }),
        ...(timestamp && { updatedAt: { $lte: timestamp } }),
        ...(extras &&
          extras.length > 0 && {
            extras: {
              $some: {
                apiName: {
                  $in: Array.isArray(extras) ? extras : [extras],
                },
              },
            },
          }),
        ...(user && {
          interactions: {
            $none: {
              user: user,
              discriminator: InteractionDiscriminator.REPORT,
              deletedAt: null,
            },
          },
        }),
      },
      {
        populate: [
          'access',
          'extras',
          'totalRatings',
          'avgClean',
          'avgStructure',
          'avgAccessibility',
          'paperAvailability',
        ],
      },
    );
  }

  /**
   * Busca casas de banho próximas a um ponto geográfico, ordenadas por distância.
   *
   * @param {number} lat A latitude do ponto central.
   * @param {number} lng A longitude do ponto central.
   * @param {AccessApiName} [access] Filtra por tipo de acesso.
   * @param {ToiletStatus} [status] Filtra por status.
   * @param {Date} [timestamp] Filtra por data de criação/atualização.
   * @param {boolean} [pageable] Ativa a paginação.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {TypeExtraApiName[]} [extras] Filtra por recursos extra.
   * @param {UserEntity} [user] O utilizador autenticado, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho ordenadas por proximidade.
   */
  async findByProximity(
    lat: number,
    lng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    extras?: TypeExtraApiName[],
    user?: UserEntity,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    // Apply joins first
    qb.leftJoinAndSelect('t.access', 'access').leftJoinAndSelect(
      't.extras',
      'extras',
    );

    // Then apply filters using the aliases
    if (access) qb.andWhere({ 'access.apiName': access });
    if (status) qb.andWhere({ status });
    if (timestamp) qb.andWhere({ updatedAt: { $lte: timestamp } });
    if (extras && extras.length > 0) {
      qb.andWhere({ 'extras.apiName': { $in: extras } });
    }

    // Filtrar casas de banho denunciadas pelo utilizador
    if (user) {
      qb.andWhere({
        interactions: {
          $none: {
            user: user,
            discriminator: InteractionDiscriminator.REPORT,
            deletedAt: null,
          },
        },
      });
    }

    if (extras && extras.length > 0) {
      qb.distinct();
    }

    const knex = qb.getKnexQuery();
    knex.select(
      em
        .getConnection()
        .getKnex()
        .raw(
          `(6371 * acos(cos(radians(?)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(?)) + sin(radians(?)) * sin(radians(t.latitude)))) as distance`,
          [lat, lng, lat],
        ),
    );
    knex.orderBy('distance', 'asc');

    if (pageable && page !== undefined && size !== undefined) {
      knex.limit(size).offset(page * size);
    }

    const results = await qb.getResultList();

    await this.repository.populate(results, [
      'totalRatings',
      'avgClean',
      'avgStructure',
      'avgAccessibility',
      'paperAvailability',
    ]);

    return results;
  }

  /**
   * Realiza uma pesquisa full-text por casas de banho.
   *
   * @param {string} query O termo de pesquisa.
   * @param {boolean} [pageable] Define se a paginação deve ser aplicada.
   * @param {number} [page] O número da página.
   * @param {number} [size] O tamanho da página.
   * @param {ToiletStatus} [state] Filtra por status.
   * @param {UserEntity} [user] O utilizador autenticado, para filtrar casas de banho denunciadas por ele.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho ordenadas por relevância.
   */
  async findByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    state?: ToiletStatus,
    user?: UserEntity,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    if (state) {
      qb.where({ status: state });
    }

    qb.where(`MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE)`, [
      query,
    ]);

    // Filtrar casas de banho denunciadas pelo utilizador
    if (user) {
      qb.andWhere({
        interactions: {
          $none: {
            user: user,
            discriminator: InteractionDiscriminator.REPORT,
            deletedAt: null,
          },
        },
      });
    }

    if (pageable && page !== undefined && size !== undefined) {
      qb.limit(size).offset(page * size);
    }

    const knex = qb.getKnexQuery();
    knex.select(
      em
        .getConnection()
        .getKnex()
        .raw(
          `MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance`,
          [query],
        ),
    );
    knex.orderBy('relevance', 'desc');

    return qb.getResultList();
  }

  /**
   * Cria e persiste uma nova casa de banho.
   *
   * @param {AccessEntity} access A entidade do tipo de acesso.
   * @param {string} name O nome da casa de banho.
   * @param {number} latitude A latitude da localização.
   * @param {number} longitude A longitude da localização.
   * @param {string} address A morada completa.
   * @param {string} city A cidade.
   * @param {string | undefined} state O estado/distrito.
   * @param {string} country O país.
   * @param {string} countryCode O código do país.
   * @param {ToiletStatus} status O status inicial.
   * @param {string | undefined} placeId O ID do Google Places.
   * @param {TypeExtraEntity[]} [extras] A lista de recursos extra.
   * @returns {Promise<ToiletEntity>} A entidade da casa de banho criada.
   */
  @Transactional()
  async create(
    access: AccessEntity,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string | undefined,
    country: string,
    countryCode: string,
    status: ToiletStatus,
    placeId: string | undefined,
    extras?: TypeExtraEntity[],
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    const toilet = new ToiletEntity();
    toilet.access = access;
    toilet.name = name;
    toilet.latitude = latitude;
    toilet.longitude = longitude;
    toilet.address = address;
    toilet.city = city;
    toilet.state = state;
    toilet.country = country;
    toilet.countryCode = countryCode;
    toilet.status = status;
    toilet.placeId = placeId;
    toilet.extras.set(extras || []);
    await em.persistAndFlush(toilet);
    return toilet;
  }

  /**
   * Atualiza os dados de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho a ser atualizada.
   * @param {AccessEntity} [access] O novo tipo de acesso.
   * @param {string} [name] O novo nome.
   * @param {number} [latitude] A nova latitude.
   * @param {number} [longitude] A nova longitude.
   * @param {string} [address] A nova morada.
   * @param {string} [city] A nova cidade.
   * @param {string} [state] O novo estado/distrito.
   * @param {string} [country] O novo país.
   * @param {string} [countryCode] O novo código do país.
   * @param {string} [placeId] O novo ID do Google Places.
   * @param {TypeExtraEntity[]} [extras] A nova lista de recursos extra.
   * @returns {Promise<ToiletEntity>} A casa de banho atualizada.
   */
  @Transactional()
  async update(
    toilet: ToiletEntity,
    access?: AccessEntity,
    name?: string,
    latitude?: number,
    longitude?: number,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    countryCode?: string,
    placeId?: string,
    extras?: TypeExtraEntity[],
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.access = access || toilet.access;
    toilet.name = name || toilet.name;
    toilet.latitude = latitude || toilet.latitude;
    toilet.longitude = longitude || toilet.longitude;
    toilet.address = address || toilet.address;
    toilet.city = city || toilet.city;
    toilet.state = state !== undefined ? state : toilet.state;
    toilet.country = country || toilet.country;
    toilet.countryCode = countryCode || toilet.countryCode;
    toilet.placeId = placeId !== undefined ? placeId : toilet.placeId;
    if (extras) {
      toilet.extras.set(extras);
    }
    await em.flush();
    return toilet;
  }

  /**
   * Busca casas de banho com soft delete expirado.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<ToiletEntity[]>} Uma lista de casas de banho expiradas.
   */
  async findExpired(retention: Date): Promise<ToiletEntity[]> {
    return this.repository.find({
      deletedAt: { $lte: retention },
    });
  }

  /**
   * Remove permanentemente as casas de banho com soft delete expirado.
   *
   * @param {Date} retention A data limite de retenção.
   * @returns {Promise<void>}
   */
  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.repository.getEntityManager();
    const toilets = await this.findExpired(retention);
    await em.removeAndFlush(toilets);
  }

  /**
   * Realiza o soft delete de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {UserEntity} deletedBy O utilizador que realiza a deleção.
   * @returns {Promise<void>}
   */
  @Transactional()
  async softDelete(toilet: ToiletEntity, deletedBy: UserEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.INACTIVE;
    toilet.deletedBy = deletedBy;
    toilet.deletedAt = new Date();
    await em.flush();
  }

  /**
   * Remove permanentemente uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho a ser removida.
   * @returns {Promise<void>}
   */
  @Transactional()
  async delete(toilet: ToiletEntity): Promise<void> {
    const em = this.repository.getEntityManager();
    await em.removeAndFlush(toilet);
  }

  /**
   * Altera o status de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {ToiletStatus} status O novo status.
   * @returns {Promise<ToiletEntity>} A casa de banho com o status atualizado.
   */
  @Transactional()
  async changeStatus(
    toilet: ToiletEntity,
    status: ToiletStatus,
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = status;
    await em.flush();
    return toilet;
  }

  /**
   * Publica uma casa de banho sugerida.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {UserEntity} user O utilizador que aprova a publicação.
   * @returns {Promise<ToiletEntity>} A casa de banho publicada.
   */
  @Transactional()
  async publish(toilet: ToiletEntity, user: UserEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.ACTIVE;
    toilet.reviewedBy = user;
    toilet.reviewedAt = new Date();
    await em.flush();
    return toilet;
  }

  /**
   * Reverte o soft delete de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @returns {Promise<ToiletEntity>} A casa de banho restaurada.
   */
  @Transactional()
  async undelete(toilet: ToiletEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.ACTIVE;
    toilet.deletedBy = undefined;
    toilet.deletedAt = undefined;
    await em.flush();
    return toilet;
  }

  /**
   * Atualiza o URL da foto de uma casa de banho.
   *
   * @param {ToiletEntity} toilet A entidade da casa de banho.
   * @param {string} photoUrl O novo URL da foto.
   * @returns {Promise<ToiletEntity>} A casa de banho com a foto atualizada.
   */
  @Transactional()
  async updatePhotoUrl(
    toilet: ToiletEntity,
    photoUrl: string,
  ): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.photoUrl = photoUrl;
    await em.flush();
    return toilet;
  }
}
