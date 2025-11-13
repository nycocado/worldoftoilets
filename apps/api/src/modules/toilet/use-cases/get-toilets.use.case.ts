import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { EnrichToiletsWithCommentRateUseCase } from '@modules/toilet/use-cases/enrich-toilets-with-comment-rate.use-case';
import { ToiletResponseDto } from '@modules/toilet/dto';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletStatus,
} from '@database/entities';

@Injectable()
export class GetToiletsUseCase {
  constructor(
    private readonly repository: ToiletRepository,
    private readonly enrichToiletWithCommentRate: EnrichToiletsWithCommentRateUseCase,
  ) {}

  async execute(
    city?: CityApiName,
    country?: CountryApiName,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.find(
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
