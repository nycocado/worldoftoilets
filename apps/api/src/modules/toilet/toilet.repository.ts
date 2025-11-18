import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  AccessApiName,
  AccessEntity,
  ToiletEntity,
  ToiletStatus,
  TypeExtraApiName,
  TypeExtraEntity,
  UserEntity,
} from '@database/entities';
import { EntityRepository, Transactional } from '@mikro-orm/mariadb';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly repository: EntityRepository<ToiletEntity>,
  ) {}

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

  async findByBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    extras?: TypeExtraApiName[],
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

  async findByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
    state?: ToiletStatus,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    if (state) {
      qb.where({ status: state });
    }

    qb.where(`MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE)`, [
      query,
    ]);

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

  @Transactional()
  async deleteExpired(retention: Date): Promise<void> {
    const em = this.repository.getEntityManager();
    const toilets = await this.repository.find({
      deletedAt: { $lte: retention },
    });
    await em.removeAndFlush(toilets);
  }

  @Transactional()
  async softDelete(toilet: ToiletEntity, deletedBy: any): Promise<void> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.INACTIVE;
    toilet.deletedBy = deletedBy;
    toilet.deletedAt = new Date();
    await em.flush();
  }

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

  @Transactional()
  async publish(toilet: ToiletEntity, user: UserEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.status = ToiletStatus.ACTIVE;
    toilet.reviewedBy = user;
    toilet.reviewedAt = new Date();
    await em.flush();
    return toilet;
  }

  @Transactional()
  async undelete(toilet: ToiletEntity): Promise<ToiletEntity> {
    const em = this.repository.getEntityManager();
    toilet.deletedBy = undefined;
    toilet.deletedAt = undefined;
    await em.flush();
    return toilet;
  }
}
