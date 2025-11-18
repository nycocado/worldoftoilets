import { Expose } from 'class-transformer';

export class TypeExtraResponseDto {
  @Expose()
  name!: string;

  @Expose()
  apiName!: string;
}
