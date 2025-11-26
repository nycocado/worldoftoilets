import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeReportCommentApiName } from '@database/entities';

/**
 * DTO de requisição para criar uma denúncia de comentário.
 */
export class CreateReportCommentRequestDto {
  /**
   * ID público do comentário a ser denunciado.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID público do comentário a ser denunciado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  commentPublicId!: string;

  /**
   * Tipo de denúncia.
   */
  @IsEnum(TypeReportCommentApiName)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tipo de denúncia',
    example: TypeReportCommentApiName.SPAM,
    enum: TypeReportCommentApiName,
  })
  typeReportComment!: TypeReportCommentApiName;
}
