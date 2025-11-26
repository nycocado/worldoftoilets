import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TypeReportReplyApiName } from 'src/database/entities/type-report-reply.entity';

/**
 * DTO de requisição para criar uma denúncia de resposta.
 */
export class CreateReportReplyRequestDto {
  @ApiProperty({
    description: 'ID público da resposta a ser denunciada.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  replyPublicId: string;

  @ApiProperty({
    description: 'Tipo da denúncia.',
    enum: TypeReportReplyApiName,
    example: TypeReportReplyApiName.INAPPROPRIATE_CONTENT,
  })
  @IsEnum(TypeReportReplyApiName)
  @IsString()
  type: TypeReportReplyApiName;
}
