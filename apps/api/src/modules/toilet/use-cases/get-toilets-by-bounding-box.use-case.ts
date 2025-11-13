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
export class GetToiletsByBoundingBoxUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly enrichToiletWithCommentRate: EnrichToiletsWithCommentRateUseCase,
  ) {}

  async execute(
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
    const toilets = await this.repository.findByBoundingBox(
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
}
