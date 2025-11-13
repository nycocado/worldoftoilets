import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletEntity,
  ToiletStatus,
} from '@database/entities';
import { EntityRepository, QueryBuilder } from '@mikro-orm/mariadb';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly repository: EntityRepository<ToiletEntity>,
  ) {}

  private applyFiltersQueryBuilder(
    qb: QueryBuilder<ToiletEntity, 't'>,
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
  ): void {
    if (city) {
      qb.andWhere({ city: { apiName: city } });
    }

    if (country) {
      qb.andWhere({ city: { country: { apiName: country } } });
    }

    if (access) {
      qb.andWhere({ access: { apiName: access } });
    }

    if (status) {
      qb.andWhere({ status });
    }

    if (timestamp) {
      qb.andWhere({ updatedAt: { $lte: timestamp } });
    }
  }

  private applyJoins(qb: any): void {
    qb.leftJoinAndSelect('t.city', 'city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('t.access', 'access')
      .leftJoinAndSelect('t.extras', 'extras')
      .leftJoinAndSelect('extras.typeExtra', 'typeExtra');
  }

  private applyPagination(
    qb: QueryBuilder<ToiletEntity, 't'>,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): void {
    if (pageable && page !== undefined && size !== undefined) {
      qb.limit(size).offset(page * size);
    }
  }

  async findByPublicId(publicId: string): Promise<ToiletEntity | null> {
    return this.repository.findOne(
      { publicId },
      {
        populate: ['city.country', 'access', 'extras.typeExtra'],
      },
    );
  }

  async find(
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletEntity[]> {
    const qb = this.repository.createQueryBuilder('t');

    this.applyFiltersQueryBuilder(qb, city, country, access, status, timestamp);
    this.applyJoins(qb);
    this.applyPagination(qb, pageable, page, size);

    return qb.getResultList();
  }

  async findByBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
  ): Promise<ToiletEntity[]> {
    const qb = this.repository.createQueryBuilder('t');

    qb.where({
      latitude: { $gte: minLat, $lte: maxLat },
      longitude: { $gte: minLng, $lte: maxLng },
    });

    this.applyFiltersQueryBuilder(qb, city, country, access, status, timestamp);
    this.applyJoins(qb);

    return qb.getResultList();
  }

  async findByProximity(
    lat: number,
    lng: number,
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    this.applyFiltersQueryBuilder(qb, city, country, access, status, timestamp);
    this.applyJoins(qb);

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

    // Apply pagination at the Knex level since QueryBuilder is finalized
    if (pageable && page !== undefined && size !== undefined) {
      knex.limit(size).offset(page * size);
    }

    return qb.getResultList();
  }

  async findByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletEntity[]> {
    const em = this.repository.getEntityManager();
    const qb = this.repository.createQueryBuilder('t');

    qb.where(`MATCH(t.name, t.address) AGAINST(? IN NATURAL LANGUAGE MODE)`, [
      query,
    ]);

    this.applyJoins(qb);
    this.applyPagination(qb, pageable, page, size);

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
}
