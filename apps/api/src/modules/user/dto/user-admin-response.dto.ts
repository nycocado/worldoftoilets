import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserSelfResponseDto } from '@modules/user/dto/user-self-response.dto';

/**
 * DTO para a resposta administrativa com informações detalhadas do utilizador.
 */
export class UserAdminResponseDto extends UserSelfResponseDto {
  @ApiProperty({
    description: 'Indica se o email foi verificado.',
    example: true,
  })
  @Expose()
  @Transform(({ obj }) => obj.credential?.emailVerified ?? false)
  emailVerified!: boolean;

  @ApiProperty({
    description: 'Data de última atualização.',
    example: '2024-01-20T14:00:00.000Z',
  })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    description: 'Data de desativação (soft delete).',
    example: null,
    nullable: true,
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  deactivatedAt!: Date | null;
}
