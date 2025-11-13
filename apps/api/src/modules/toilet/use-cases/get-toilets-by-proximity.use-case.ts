import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { EnrichToiletsWithCommentRateUseCase } from '@modules/toilet/use-cases/enrich-toilets-with-comment-rate.use-case';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletStatus,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';

@Injectable()
export class GetToiletsByProximityUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly enrichToiletWithCommentRate: EnrichToiletsWithCommentRateUseCase,
  ) {}

  async execute(
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
    const toilets = await this.repository.findByProximity(
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
}
