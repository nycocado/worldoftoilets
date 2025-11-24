import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RouteService } from '@modules/route/route.service';
import { RouteResponseDto } from '../dto';

/**
 * Contém a lógica de negócio para calcular uma rota entre dois pontos geográficos.
 */
@Injectable()
export class CalculateRouteUseCase {
  constructor(private readonly routeService: RouteService) {}

  /**
   * Calcula uma rota entre as coordenadas de origem e destino.
   *
   * @param {number} originLat A latitude do ponto de origem.
   * @param {number} originLon A longitude do ponto de origem.
   * @param {number} destLat A latitude do ponto de destino.
   * @param {number} destLon A longitude do ponto de destino.
   * @returns {Promise<RouteResponseDto>} Os dados da rota calculada.
   * @throws {BadRequestException} Se as coordenadas forem inválidas.
   * @throws {ServiceUnavailableException} Se o serviço estiver indisponível.
   */
  async execute(
    originLat: number,
    originLon: number,
    destLat: number,
    destLon: number,
  ): Promise<RouteResponseDto> {
    const routeData = await this.routeService.calculateRoute(
      originLat,
      originLon,
      destLat,
      destLon,
    );

    return plainToInstance(RouteResponseDto, routeData, {
      excludeExtraneousValues: true,
    });
  }
}
