import { Expose } from 'class-transformer';

export class CountryResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;
}