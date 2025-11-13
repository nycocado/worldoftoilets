import { Expose, Type } from 'class-transformer';
import { CountryResponseDto } from '@modules/toilet/dto/country-response.dto';

export class CityResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;

  @Expose()
  @Type(() => CountryResponseDto)
  country!: CountryResponseDto;
}
