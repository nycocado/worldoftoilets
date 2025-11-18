import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { AccessResponseDto } from '@modules/toilet/dto/access-response.dto';
import { TypeExtraResponseDto } from '@modules/toilet/dto/type-extra-response.dto';
import { CommentRateToiletResponseDto } from '@modules/comment-rate/dto';

export class ToiletResponseDto {
  @Expose()
  publicId!: string;

  @Expose()
  @Type(() => AccessResponseDto)
  access!: AccessResponseDto;

  @Expose()
  @Transform(({ obj }) => {
    const items = obj.extras ?? [];
    return items.map((e: any) =>
      plainToInstance(TypeExtraResponseDto, e, {
        excludeExtraneousValues: true,
      }),
    );
  })
  extras: Array<TypeExtraResponseDto>;

  @Expose()
  name!: string;

  @Expose()
  latitude!: number;

  @Expose()
  longitude!: number;

  @Expose()
  address!: string;

  @Expose()
  city!: string;

  @Expose()
  state?: string;

  @Expose()
  country!: string;

  @Expose()
  countryCode!: string;

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
