import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO com as informações base de um utilizador.
 */
export class UserBaseDto {
  @ApiProperty({
    description: 'O ID público do utilizador.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @Expose()
  @Type(() => String)
  publicId!: string;

  @ApiProperty({
    description: 'O nome de exibição do utilizador.',
    example: 'John Doe',
  })
  @Expose()
  @Type(() => String)
  name!: string;

  @ApiProperty({
    description: 'O ícone de perfil do utilizador.',
    example: 'icon-default',
  })
  @Expose()
  @Type(() => String)
  icon!: string;

  @ApiProperty({
    description: 'O número total de comentários feitos pelo utilizador.',
    example: 10,
  })
  @Expose()
  @Type(() => Number)
  commentsCount!: number;
}
