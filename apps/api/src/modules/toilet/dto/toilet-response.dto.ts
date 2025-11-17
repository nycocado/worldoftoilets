import { Expose, Transform, Type } from 'class-transformer';
import { CityResponseDto } from '@modules/toilet/dto/city-response.dto';
import { AccessResponseDto } from '@modules/toilet/dto/access-response.dto';
import { ExtraResponseDto } from '@modules/toilet/dto/extra-response.dto';
import { CommentRateToiletResponseDto } from '@modules/comment-rate/dto';

export class ToiletResponseDto {
  @Expose()
  publicId!: string;

  @Expose()
  @Type(() => CityResponseDto)
  city!: CityResponseDto;

  @Expose()
  @Type(() => AccessResponseDto)
  access!: AccessResponseDto;

  @Expose()
  @Transform(({ obj }) => {
    const validExtras = (obj.extras ?? []).filter(
      (extra: any) => extra.typeExtra,
    );
    return validExtras.map((extra: any) => ({
      name: extra.typeExtra.name,
      apiName: extra.typeExtra.apiName,
    }));
  })
  extras: ExtraResponseDto[];

  @Expose()
  name!: string;

  @Expose()
  latitude!: number;

  @Expose()
  longitude!: number;

  @Expose()
  address!: string;

  @Expose()
  photoUrl!: string;

  @Expose()
  placeId!: string;

  @Expose()
  @Transform(({ obj }) => ({
    totalRatings: obj.totalRatings ?? 0,
    avgClean: obj.avgClean ?? 0,
    avgStructure: obj.avgStructure ?? 0,
    avgAccessibility: obj.avgAccessibility ?? 0,
    paperAvailability: obj.paperAvailability ?? 0,
  }))
  rating: CommentRateToiletResponseDto;
}
