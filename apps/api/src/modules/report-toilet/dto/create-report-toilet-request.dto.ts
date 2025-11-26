import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeReportToiletApiName } from '@database/entities';

/**
 * DTO para a operação de criação de uma denúncia de casa de banho.
 */
export class CreateReportToiletRequestDto {
  @ApiProperty({
    description: 'ID público da casa de banho a denunciar.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  toiletPublicId: string;

  @ApiProperty({
    description: 'Tipo de denúncia.',
    enum: TypeReportToiletApiName,
    example: TypeReportToiletApiName.FAKE_INFORMATION,
  })
  @IsEnum(TypeReportToiletApiName)
  @IsNotEmpty()
  typeReportToilet: TypeReportToiletApiName;
}
