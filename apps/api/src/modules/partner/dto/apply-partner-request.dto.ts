import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

/**
 * DTO para a candidatura de parceria (formulário público/anônimo).
 */
export class ApplyPartnerRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID público da casa de banho que o candidato representa.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  toiletPublicId!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description:
      'E-mail de contacto para assuntos relacionados com a parceria.',
    example: 'contacto@shopping-colombo.pt',
    maxLength: 100,
  })
  contactEmail!: string;
}
