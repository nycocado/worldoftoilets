import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { RouteGrpcService } from './route.grpc.service';
import { ROUTE_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de comunicação com o microsserviço de cálculo de rotas.
 */
@Injectable()
export class RouteService {
  constructor(private readonly routeGrpcService: RouteGrpcService) {}

  /**
   * Calcula uma rota entre dois pontos geográficos usando gRPC.
   *
   * @param {number} originLat A latitude do ponto de origem.
   * @param {number} originLon A longitude do ponto de origem.
   * @param {number} destLat A latitude do ponto de destino.
   * @param {number} destLon A longitude do ponto de destino.
   * @returns {Promise<any>} Os dados da rota calculada pelo microsserviço.
   * @throws {BadRequestException} Se as coordenadas forem inválidas ou fora da área de serviço.
   * @throws {ServiceUnavailableException} Se o microsserviço estiver indisponível.
   */
  async calculateRoute(
    originLat: number,
    originLon: number,
    destLat: number,
    destLon: number,
  ): Promise<any> {
    try {
      return await this.routeGrpcService.calculateRoute(
        originLat,
        originLon,
        destLat,
        destLon,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      throw new ServiceUnavailableException(
        ROUTE_EXCEPTIONS.SERVICE_UNAVAILABLE,
      );
    }
  }
}
