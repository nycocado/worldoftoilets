import { Injectable, NotFoundException } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet/toilet.repository';
import { TOILET_EXCEPTIONS } from '@modules/toilet/constants/exceptions.constant';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletEntity,
  ToiletStatus,
} from '@database/entities';
import { EnrichToiletsWithCommentRateUseCase } from '@modules/toilet/use-cases';
import {
  SearchToiletResponseDto,
  ToiletResponseDto,
} from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ToiletService {
  constructor(
    private readonly toiletRepository: ToiletRepository,
    private readonly enrichToiletWithCommentRate: EnrichToiletsWithCommentRateUseCase,
  ) {}

  async findToiletByPublicId(publicId: string): Promise<ToiletEntity> {
    const toilet = await this.toiletRepository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    return toilet;
  }

  async getToiletByPublicId(publicId: string): Promise<ToiletResponseDto> {
    const toilet = await this.toiletRepository.findByPublicId(publicId);
    if (!toilet) {
      throw new NotFoundException(TOILET_EXCEPTIONS.TOILET_NOT_FOUND);
    }
    const dto = await this.enrichToiletWithCommentRate.execute([toilet]);
    return dto[0];
  }

  async getToilets(
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.toiletRepository.find(
      city,
      country,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
    );

    return await this.enrichToiletWithCommentRate.execute(toilets);
  }

  async getByBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.toiletRepository.findByBoundingBox(
      minLat,
      minLng,
      maxLat,
      maxLng,
      city,
      country,
      access,
      status,
      timestamp,
    );

    return await this.enrichToiletWithCommentRate.execute(toilets);
  }

  async getByProximity(
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
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.toiletRepository.findByProximity(
      lat,
      lng,
      city,
      country,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
    );

    return await this.enrichToiletWithCommentRate.execute(toilets);
  }

  async getByFullTextSearch(
    query: string,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<SearchToiletResponseDto[]> {
    const toilets = await this.toiletRepository.findByFullTextSearch(
      query,
      pageable,
      page,
      size,
    );

    return plainToInstance(SearchToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
