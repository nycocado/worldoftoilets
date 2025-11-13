import { Expose, Type } from 'class-transformer';
import { ToiletAverageRating } from '@modules/comment-rate';
import { CityResponseDto } from '@modules/toilet/dto/city-response.dto';
import { AccessResponseDto } from '@modules/toilet/dto/access-response.dto';
import { ExtraResponseDto } from '@modules/toilet/dto/extra-response.dto';

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
  latitude!: number;

  @Expose()
  longitude!: number;

  @Expose()
  address!: string;

  @Expose()
  photoUrl!: string;

  @Expose()
  placeId!: string;

  rating: ToiletAverageRating;
}
