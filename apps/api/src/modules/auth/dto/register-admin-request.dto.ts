import { RegisterRequestDto } from '@modules/auth/dto/register-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Define os tipos de roles administrativas disponíveis no sistema.
 */
export enum RoleType {
  COMMENTS_ADMINISTRATOR = 'comments-administrator',
  TOILETS_ADMINISTRATOR = 'toilets-administrator',
  PARTNERS_ADMINISTRATOR = 'partners-administrator',
  DEAD_ADMINISTRATOR = 'dead-administrator',
}

/**
 * DTO para a requisição de registo de uma nova conta administrativa.
 */
export class RegisterAdminRequestDto {
  @ApiProperty({
    type: RegisterRequestDto,
    description: 'Os dados de registo do novo utilizador administrativo.',
  })
  @ValidateNested()
  @Type(() => RegisterRequestDto)
  @IsNotEmpty()
  user!: RegisterRequestDto;

  @ApiProperty({
    enum: RoleType,
    isArray: true,
    description: 'As roles administrativas a serem atribuídas ao utilizador.',
    example: [RoleType.COMMENTS_ADMINISTRATOR, RoleType.TOILETS_ADMINISTRATOR],
  })
  @IsArray()
  @IsEnum(RoleType, { each: true })
  @IsNotEmpty()
  roles!: RoleType[];
}
