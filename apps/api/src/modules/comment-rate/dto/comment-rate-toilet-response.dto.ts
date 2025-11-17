import { Expose } from 'class-transformer';

export class CommentRateToiletResponseDto {
  @Expose()
  totalRatings!: number;

  @Expose()
  avgClean!: number;

  @Expose()
  avgStructure!: number;

  @Expose()
  avgAccessibility!: number;

  @Expose()
  paperAvailability!: number;
}
