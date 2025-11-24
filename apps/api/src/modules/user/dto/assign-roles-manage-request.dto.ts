import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { RoleApiName } from '@database/entities/role.entity';

/**
 * DTO para a requisição de atribuição de cargos a um utilizador (manage).
 */
export class AssignRolesManageRequestDto {
  @ApiProperty({
    description: 'Lista de cargos a atribuir ao utilizador.',
    enum: RoleApiName,
    isArray: true,
    example: [RoleApiName.COMMENTS_USER, RoleApiName.REACTION_USER],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoleApiName, { each: true })
  roles!: RoleApiName[];
}
