import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  toiletPublicId!: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateCommentRateRequestDto)
  rate!: CreateCommentRateRequestDto;
}
