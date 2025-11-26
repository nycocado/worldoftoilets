import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TypeReportCommentApiName } from '@database/entities';

/**
 * DTO de resposta para tipo de denúncia de comentário.
 */
export class TypeReportCommentResponseDto {
  /**
   * Nome de API do tipo de denúncia.
   */
  @Expose()
  @ApiProperty({
    description: 'Nome de API do tipo de denúncia',
    example: TypeReportCommentApiName.SPAM,
    enum: TypeReportCommentApiName,
  })
  apiName!: TypeReportCommentApiName;

  /**
   * Nome legível do tipo de denúncia.
   */
  @Expose()
  @ApiProperty({
    description: 'Nome legível do tipo de denúncia',
    example: 'Spam',
  })
  name!: string;
}
