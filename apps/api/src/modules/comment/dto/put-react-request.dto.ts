import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReactType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export class PutReactRequestDto {
  @ApiProperty()
  @IsEnum(ReactType)
  @IsNotEmpty()
  react!: ReactType;
}
