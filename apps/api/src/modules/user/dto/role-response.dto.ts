import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a resposta com informações de um cargo.
 */
export class RoleResponseDto {
  @ApiProperty({
    description: 'Nome descritivo do cargo.',
    example: 'Administrador de Comentários',
  })
  @Expose()
  @Type(() => String)
  name!: string;

  @ApiProperty({
    description: 'Identificador da API do cargo.',
    example: 'comments-administrator',
  })
  @Expose()
  @Type(() => String)
  apiName!: string;
}
