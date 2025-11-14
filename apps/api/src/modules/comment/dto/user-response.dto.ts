import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  publicId!: string;

  @Expose()
  name!: string;

  @Expose()
  points!: number;

  @Expose()
  icon!: string;

  @Expose()
  isPartner!: boolean;

  @Expose()
  commentsCount!: number;
}
