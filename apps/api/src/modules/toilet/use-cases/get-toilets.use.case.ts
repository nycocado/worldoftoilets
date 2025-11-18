import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import { ToiletResponseDto } from '@modules/toilet/dto';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetToiletsUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  async execute(
    city?: string,
    country?: string,
    countryCode?: string,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.find(
      city,
      country,
      countryCode,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
      typeExtra,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
