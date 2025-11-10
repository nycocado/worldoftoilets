import { Expose, Transform, Type } from 'class-transformer';
import { ToiletAverageRating } from '@modules/comment-rate';

export class CountryResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;
}

export class CityResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;

  @Expose()
  @Type(() => CountryResponseDto)
  country!: CountryResponseDto;
}

export class AccessResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;
}

export class ExtraResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.typeExtra.name)
  name!: string;

  @Expose()
  @Transform(({ obj }) => obj.typeExtra.apiName)
  apiName!: string;
}

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
  @Type(() => ExtraResponseDto)
  extras: ExtraResponseDto[];

  @Expose()
  name!: string;

  @Expose()
  @Transform(({ obj }) => obj.coordinates.latitude)
  latitude!: number;

  @Expose()
  @Transform(({ obj }) => obj.coordinates.longitude)
  longitude!: number;

  @Expose()
  address!: string;

  @Expose()
  photoUrl!: string;

  @Expose()
  placeId!: string;

  rating: ToiletAverageRating;
}
