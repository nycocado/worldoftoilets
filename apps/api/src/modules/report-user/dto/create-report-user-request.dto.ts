import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TypeReportUserApiName } from 'src/database/entities/type-report-user.entity';

/**
 * DTO de requisição para criar uma denúncia de utilizador.
 */
export class CreateReportUserRequestDto {
  @ApiProperty({
    description: 'ID público do utilizador a ser denunciado.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userReportedPublicId: string;

  @ApiProperty({
    description: 'Tipo da denúncia.',
    enum: TypeReportUserApiName,
    example: TypeReportUserApiName.HARASSMENT_ABUSE,
  })
  @IsEnum(TypeReportUserApiName)
  @IsString()
  type: TypeReportUserApiName;
}
