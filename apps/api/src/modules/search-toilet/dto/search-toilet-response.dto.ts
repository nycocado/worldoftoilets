import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * DTO para a resposta da pesquisa de casas de banho.
 */
export class SearchToiletResponseDto {
  @ApiProperty({ description: 'O ID público da casa de banho.' })
  @Expose()
  publicId!: string;

  @ApiProperty({ description: 'O nome da casa de banho.' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'A morada da casa de banho.' })
  @Expose()
  address!: string;
}
