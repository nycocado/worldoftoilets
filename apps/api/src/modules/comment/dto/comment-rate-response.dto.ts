import { Expose } from 'class-transformer';

export class CommentRateResponseDto {
  @Expose()
  clean!: number;

  @Expose()
  paper!: boolean;

  @Expose()
  structure!: number;

  @Expose()
  accessibility!: number;
}
