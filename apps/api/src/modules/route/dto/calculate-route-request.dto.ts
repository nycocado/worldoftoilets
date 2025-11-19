import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para o pedido de cálculo de rota.
 */
export class CalculateRouteRequestDto {
  @ApiProperty({
    description: 'Latitude do ponto de origem.',
    example: 38.7072,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsLatitude()
  originLat!: number;

  @ApiProperty({
    description: 'Longitude do ponto de origem.',
    example: -9.1365,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsLongitude()
  originLon!: number;

  @ApiProperty({
    description: 'Latitude do ponto de destino.',
    example: 38.7139,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsLatitude()
  destLat!: number;

  @ApiProperty({
    description: 'Longitude do ponto de destino.',
    example: -9.1334,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsLongitude()
  destLon!: number;
}
