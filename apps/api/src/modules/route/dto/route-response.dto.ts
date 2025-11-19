import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RouteStatsResponseDto } from '@modules/route';

/**
 * DTO para a resposta de uma rota calculada.
 */
export class RouteResponseDto {
  @ApiProperty({
    description: 'Status da operação.',
    example: 'success',
  })
  @Expose()
  @Type(() => String)
  status!: string;

  @ApiProperty({
    description: 'Algoritmo utilizado para calcular a rota.',
    example: 'A*',
  })
  @Expose()
  @Type(() => String)
  algorithm!: string;

  @ApiProperty({
    description:
      'Caminho calculado como array de coordenadas [longitude, latitude].',
    example: [
      [-9.1365, 38.7072],
      [-9.135, 38.71],
      [-9.1334, 38.7139],
    ],
    type: Array<Array<number>>,
  })
  @Expose()
  path!: number[][];

  @ApiProperty({
    description: 'Estatísticas da rota calculada.',
    type: () => RouteStatsResponseDto,
  })
  @Expose()
  @Type(() => RouteStatsResponseDto)
  stats!: RouteStatsResponseDto;
}
