import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { RoleApiName } from '@database/entities/role.entity';

/**
 * DTO para a requisição de remoção de cargos de um utilizador (manage).
 */
export class RemoveRolesManageRequestDto {
  @ApiProperty({
    description: 'Lista de cargos a remover do utilizador.',
    enum: RoleApiName,
    isArray: true,
    example: [RoleApiName.COMMENTS_USER],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoleApiName, { each: true })
  roles!: RoleApiName[];
}
