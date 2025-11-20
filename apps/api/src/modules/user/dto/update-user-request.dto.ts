import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { UserIcon } from '@database/entities/user.entity';

/**
 * DTO para a requisição de atualização de informações do utilizador.
 */
export class UpdateUserRequestDto {
  @ApiProperty({
    description: 'Nome do utilizador.',
    example: 'João Silva',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Ícone/avatar do utilizador.',
    enum: UserIcon,
    example: UserIcon.ICON_1,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserIcon)
  icon?: UserIcon;

  @ApiProperty({
    description: 'Data de nascimento do utilizador.',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
