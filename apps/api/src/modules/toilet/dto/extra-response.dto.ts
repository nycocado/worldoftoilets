import { Expose, Transform } from 'class-transformer';

export class ExtraResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.typeExtra.name)
  name!: string;

  @Expose()
  @Transform(({ obj }) => obj.typeExtra.apiName)
  apiName!: string;
}
