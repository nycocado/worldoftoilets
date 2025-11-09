import { UpdateCommentRateRequestDto } from '@modules/comment/dto/update-comment-rate-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentRateRequestDto } from '@modules/comment/dto/create-comment-rate-request.dto';

export class UpdateCommentRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  @IsOptional()
  @Type(() => String)
  text?: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateCommentRateRequestDto)
  rate?: UpdateCommentRateRequestDto;
}
