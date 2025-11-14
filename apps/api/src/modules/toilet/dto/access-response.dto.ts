import { Expose } from 'class-transformer';

export class AccessResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;
}
