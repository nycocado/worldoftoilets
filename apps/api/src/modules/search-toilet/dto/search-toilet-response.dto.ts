import { Expose } from 'class-transformer';

export class SearchToiletResponseDto {
  @Expose()
  publicId!: string;

  @Expose()
  name!: string;

  @Expose()
  address!: string;
}
