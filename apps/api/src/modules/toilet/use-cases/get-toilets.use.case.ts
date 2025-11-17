import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { ToiletResponseDto } from '@modules/toilet/dto';
import {
  AccessApiName,
  CityApiName,
  CountryApiName,
  ToiletStatus,
} from '@database/entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetToiletsUseCase {
  constructor(private readonly repository: ToiletRepository) {}

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

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
