import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RouteService } from '../route.service';
import { RouteResponseDto } from '../dto';
import { ToiletService } from '@modules/toilet';

/**
 * Contém a lógica de negócio para calcular uma rota até um toilet específico.
 */
@Injectable()
export class CalculateRouteToToiletUseCase {
  constructor(
    private readonly routeService: RouteService,
    private readonly toiletService: ToiletService,
  ) {}

  /**
   * Calcula uma rota desde a origem até as coordenadas de um toilet.
   *
   * @param {number} originLat A latitude do ponto de origem.
   * @param {number} originLon A longitude do ponto de origem.
   * @param {string} toiletPublicId O identificador público do toilet de destino.
   * @returns {Promise<RouteResponseDto>} Os dados da rota calculada.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {BadRequestException} Se as coordenadas forem inválidas.
   * @throws {ServiceUnavailableException} Se o serviço estiver indisponível.
   */
  async execute(
    originLat: number,
    originLon: number,
    toiletPublicId: string,
  ): Promise<RouteResponseDto> {
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);

    const routeData = await this.routeService.calculateRoute(
      originLat,
      originLon,
      toilet.latitude,
      toilet.longitude,
    );

    return plainToInstance(RouteResponseDto, routeData, {
      excludeExtraneousValues: true,
    });
  }
}
