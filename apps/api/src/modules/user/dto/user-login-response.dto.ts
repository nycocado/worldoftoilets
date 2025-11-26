import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';
import { RoleResponseDto } from '@modules/user/dto/role-response.dto';

/**
 * DTO para a resposta com os dados do utilizador após o login.
 */
export class UserLoginResponseDto extends UserBaseDto {
  @ApiProperty({
    description: 'O email do utilizador.',
    example: 'user@example.com',
  })
  @Expose()
  @Type(() => String)
  email: string;

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
}
