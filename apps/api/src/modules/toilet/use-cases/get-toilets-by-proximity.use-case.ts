import { Injectable } from '@nestjs/common';
import { ToiletRepository } from '@modules/toilet';
import {
  AccessApiName,
  ToiletStatus,
  TypeExtraApiName,
} from '@database/entities';
import { ToiletResponseDto } from '@modules/toilet/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetToiletsByProximityUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  async execute(
    lat: number,
    lng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    pageable?: boolean,
    page?: number,
    size?: number,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.findByProximity(
      lat,
      lng,
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
