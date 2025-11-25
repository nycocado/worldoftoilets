import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para atualizar informações de contacto da parceria.
 */
export class UpdatePartnerRequestDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({
    description: 'E-mail de contacto para a parceria.',
    example: 'novo-contacto@estabelecimento.pt',
    maxLength: 100,
    required: false,
  })
  contactEmail?: string;
}
