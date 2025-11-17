import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletStatus,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetToiletsByProximityUseCase {
  constructor(private readonly repository: ToiletRepository) {}

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

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
