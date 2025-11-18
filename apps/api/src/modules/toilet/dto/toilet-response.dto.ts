import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccessResponseDto } from '@modules/toilet/dto/access-response.dto';
import { TypeExtraResponseDto } from '@modules/toilet/dto/type-extra-response.dto';
import { CommentRateToiletResponseDto } from '@modules/comment-rate/dto';

/**
 * DTO de Response para Toilet
 *
 * @class ToiletResponseDto
 * @description Transfer Object para resposta com dados completos de um toilet
 *
 * @property {string} publicId - ID público UUID do toilet
 * @property {AccessResponseDto} access - Dados do tipo de acesso
 * @property {TypeExtraResponseDto[]} extras - Lista de extras disponíveis
 * @property {string} name - Nome do toilet
 * @property {number} latitude - Latitude da localização
 * @property {number} longitude - Longitude da localização
 * @property {string} address - Endereço completo
 * @property {string} city - Cidade
 * @property {string} [state] - Estado/província (opcional)
 * @property {string} country - País
 * @property {string} countryCode - Código ISO do país (2 letras)
 * @property {string} photoUrl - URL da foto do toilet
 * @property {string} placeId - ID do Google Places
 * @property {CommentRateToiletResponseDto} rating - Estatísticas de avaliação
 *
 * @example
 * {
 *   "publicId": "550e8400-e29b-41d4-a716-446655440000",
 *   "access": { "apiName": "PUBLIC", "name": "Público" },
 *   "extras": [{ "apiName": "WIFI", "name": "Wi-Fi" }],
 *   "name": "Casa de Banho Central",
 *   "latitude": 38.7223,
 *   "longitude": -9.1393,
 *   "address": "Praça do Comércio, 1",
 *   "city": "Lisboa",
 *   "state": "Lisboa",
 *   "country": "Portugal",
 *   "countryCode": "PT",
 *   "photoUrl": "https://api.example.com/files/toilets/uuid.jpg",
 *   "placeId": "ChIJa2s3k...",
 *   "rating": {
 *     "totalRatings": 42,
 *     "avgClean": 4.5,
 *     "avgStructure": 4.2,
 *     "avgAccessibility": 4.8,
 *     "paperAvailability": 0.95
 *   }
 * }
 */
export class ToiletResponseDto {
  /**
   * ID público do toilet
   *
   * @type {string}
   * @format uuid
   * @description Identificador único UUID do toilet
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty()
  @Expose()
  publicId!: string;

  /**
   * Dados do tipo de acesso
   *
   * @type {AccessResponseDto}
   * @description Informação sobre tipo de acesso (público, privado, apenas clientes)
   */
  @ApiProperty({ type: () => AccessResponseDto })
  @Expose()
  @Type(() => AccessResponseDto)
  access!: AccessResponseDto;

  /**
   * Lista de extras disponíveis
   *
   * @type {TypeExtraResponseDto[]}
   * @description Amenidades e recursos disponíveis no toilet
   */
  @ApiProperty({ type: () => [TypeExtraResponseDto] })
  @Expose()
  @Transform(({ obj }) => {
    const items = obj.extras ?? [];
    return items.map((e: any) =>
      plainToInstance(TypeExtraResponseDto, e, {
        excludeExtraneousValues: true,
      }),
    );
  })
  extras: Array<TypeExtraResponseDto>;

  /**
   * Nome do toilet
   *
   * @type {string}
   * @description Nome identificador do toilet
   * @example "Casa de Banho Central"
   */
  @ApiProperty()
  @Expose()
  name!: string;

  /**
   * Latitude da localização
   *
   * @type {number}
   * @description Coordenada de latitude em graus decimais
   * @example 38.7223
   */
  @ApiProperty()
  @Expose()
  latitude!: number;

  /**
   * Longitude da localização
   *
   * @type {number}
   * @description Coordenada de longitude em graus decimais
   * @example -9.1393
   */
  @ApiProperty()
  @Expose()
  longitude!: number;

  /**
   * Endereço completo
   *
   * @type {string}
   * @description Endereço postal completo do toilet
   * @example "Praça do Comércio, 1"
   */
  @ApiProperty()
  @Expose()
  address!: string;

  /**
   * Cidade
   *
   * @type {string}
   * @description Cidade onde o toilet está localizado
   * @example "Lisboa"
   */
  @ApiProperty()
  @Expose()
  city!: string;

  /**
   * Estado ou província (opcional)
   *
   * @type {string}
   * @description Estado/província/região onde o toilet está localizado
   * @example "Lisboa"
   */
  @ApiProperty({ required: false })
  @Expose()
  state?: string;

  /**
   * País
   *
   * @type {string}
   * @description Nome do país onde o toilet está localizado
   * @example "Portugal"
   */
  @ApiProperty()
  @Expose()
  country!: string;

  /**
   * Código ISO do país
   *
   * @type {string}
   * @description Código ISO 3166-1 alpha-2 do país (2 letras)
   * @example "PT"
   */
  @ApiProperty()
  @Expose()
  countryCode!: string;

  /**
   * URL da foto do toilet
   *
   * @type {string}
   * @description URL pública da imagem do toilet
   * @example "https://api.example.com/files/toilets/uuid.jpg"
   */
  @ApiProperty()
  @Expose()
  photoUrl!: string;

  /**
   * Google Places ID
   *
   * @type {string}
   * @description Identificador do Google Places para este local
   * @example "ChIJa2s3kTIzGQ0RUIedOPb0Og0"
   */
  @ApiProperty()
  @Expose()
  placeId!: string;

  /**
   * Estatísticas de avaliação
   *
   * @type {CommentRateToiletResponseDto}
   * @description Médias de avaliações e estatísticas do toilet
   */
  @ApiProperty({ type: () => CommentRateToiletResponseDto })
  @Expose()
  @Transform(({ obj }) => ({
    totalRatings: obj.totalRatings ?? 0,
    avgClean: obj.avgClean ?? 0,
    avgStructure: obj.avgStructure ?? 0,
    avgAccessibility: obj.avgAccessibility ?? 0,
    paperAvailability: obj.paperAvailability ?? 0,
  }))
  rating: CommentRateToiletResponseDto;
}
