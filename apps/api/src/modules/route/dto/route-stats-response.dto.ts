import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para as estatísticas da rota calculada.
 */
export class RouteStatsResponseDto {
  @ApiProperty({
    description: 'Distância total da rota em metros.',
    example: 1234.56,
  })
  @Expose({ name: 'distance_meters' })
  @Type(() => Number)
  distanceMeters!: number;

  @ApiProperty({
    description: 'Tempo estimado para percorrer a rota em segundos.',
    example: 949.66,
  })
  @Expose({ name: 'time_seconds' })
  @Type(() => Number)
  timeSeconds!: number;

  @ApiProperty({
    description: 'Número de nós no caminho calculado.',
    example: 15,
  })
  @Expose({ name: 'nodes_in_path' })
  @Type(() => Number)
  nodesInPath!: number;

  @ApiProperty({
    description: 'Número de nós expandidos durante o cálculo.',
    example: 87,
  })
  @Expose({ name: 'nodes_expanded' })
  @Type(() => Number)
  nodesExpanded!: number;
}
