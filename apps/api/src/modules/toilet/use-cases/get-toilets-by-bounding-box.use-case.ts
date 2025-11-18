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
export class GetToiletsByBoundingBoxUseCase {
  constructor(private readonly repository: ToiletRepository) {}

  async execute(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    access?: AccessApiName,
    status?: ToiletStatus,
    timestamp?: Date,
    typeExtra?: TypeExtraApiName[],
  ): Promise<ToiletResponseDto[]> {
    const toilets = await this.repository.findByBoundingBox(
      minLat,
      minLng,
      maxLat,
      maxLng,
      access,
      status,
      timestamp,
      typeExtra,
    );

    return plainToInstance(ToiletResponseDto, toilets, {
      excludeExtraneousValues: true,
    });
  }
}
