import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from './role-response.dto';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO para a resposta com informações do próprio utilizador.
 */
export class UserSelfResponseDto extends UserBaseDto {
  @ApiProperty({
    description: 'Email do utilizador.',
    example: 'joao@example.com',
  })
  @Expose()
  @Transform(({ obj }) => obj.credential?.email)
  email!: string;

  @ApiProperty({
    description: 'Pontos acumulados pelo utilizador.',
    example: 150,
  })
  @Expose()
  @Type(() => Number)
  points!: number;

  @ApiProperty({
    description: 'Data de nascimento do utilizador.',
    example: '1990-01-15',
  })
  @Expose()
  @Type(() => Date)
  birthDate!: Date;

  @ApiProperty({
    description: 'Indica se o utilizador é parceiro.',
    example: false,
  })
  @Expose()
  isPartner!: boolean;

  @ApiProperty({
    description: 'Cargos do utilizador.',
    type: [RoleResponseDto],
  })
  @Expose()
  @Transform(({ obj }) => {
    const items = obj.roles ?? [];
    return items.map((role: any) =>
      plainToInstance(RoleResponseDto, role, {
        excludeExtraneousValues: true,
      }),
    );
  })
  roles!: RoleResponseDto[];

  @ApiProperty({
    description: 'Data de criação da conta.',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
