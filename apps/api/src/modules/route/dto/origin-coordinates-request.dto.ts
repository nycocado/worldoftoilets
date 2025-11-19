import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para as coordenadas de origem do utilizador.
 */
export class OriginCoordinatesRequestDto {
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
}
