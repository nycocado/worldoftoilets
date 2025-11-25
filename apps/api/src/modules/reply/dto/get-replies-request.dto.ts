import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para a requisição de listagem de respostas.
 */
export class GetRepliesRequestDto {
  @ApiProperty({
    description: 'Define se a paginação deve ser aplicada.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageable?: boolean = true;

  @ApiProperty({
    description: 'O número da página a ser retornada.',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({
    description: 'O número de itens por página.',
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  @ApiProperty({
    description:
      'O timestamp de referência para a paginação (retorna itens criados antes ou no momento do timestamp).',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date = new Date();
}
