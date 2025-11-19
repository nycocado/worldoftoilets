import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ROUTE_EXCEPTIONS } from './constants';

/**
 * Contém a lógica de comunicação com o microsserviço de cálculo de rotas.
 */
@Injectable()
export class RouteService {
  private readonly aiServiceUrl: string;
  private readonly requestTimeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.getOrThrow<string>('AI_SERVICE_URL');
    this.requestTimeout = Number(
      this.configService.getOrThrow<string>('AI_SERVICE_TIMEOUT'),
    );
  }

  /**
   * Calcula uma rota entre dois pontos geográficos.
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
    const url = `${this.aiServiceUrl}/${originLat},${originLon}/${destLat},${destLon}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url).pipe(
          timeout(this.requestTimeout),
          catchError((error: AxiosError) => {
            throw this.handleAiServiceError(error);
          }),
        ),
      );

      return response.data;
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

  /**
   * Converte erros do microsserviço AI em exceções apropriadas do NestJS.
   *
   * @param {AxiosError} error O erro retornado pelo Axios.
   * @returns {Error} A exceção apropriada para o tipo de erro.
   */
  private handleAiServiceError(error: AxiosError): Error {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new ServiceUnavailableException(
        ROUTE_EXCEPTIONS.SERVICE_UNAVAILABLE,
      );
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      return new ServiceUnavailableException(ROUTE_EXCEPTIONS.REQUEST_TIMEOUT);
    }

    const responseData = error.response?.data as
      | { code?: string; message?: string }
      | undefined;

    if (error.response?.status === 400 && responseData) {
      const errorCode = responseData.code;

      switch (errorCode) {
        case 'INVALID_FORMAT':
          return new BadRequestException(
            ROUTE_EXCEPTIONS.INVALID_COORDINATES_FORMAT,
          );
        case 'OUT_OF_RANGE_LATITUDE':
          return new BadRequestException(
            ROUTE_EXCEPTIONS.LATITUDE_OUT_OF_RANGE,
          );
        case 'OUT_OF_RANGE_LONGITUDE':
          return new BadRequestException(
            ROUTE_EXCEPTIONS.LONGITUDE_OUT_OF_RANGE,
          );
        case 'OUT_OF_SERVICE_AREA_ORIGIN':
          return new BadRequestException(
            ROUTE_EXCEPTIONS.ORIGIN_OUT_OF_SERVICE_AREA,
          );
        case 'OUT_OF_SERVICE_AREA_DEST':
          return new BadRequestException(
            ROUTE_EXCEPTIONS.DESTINATION_OUT_OF_SERVICE_AREA,
          );
        default:
          return new BadRequestException(
            ROUTE_EXCEPTIONS.ROUTE_CALCULATION_FAILED,
          );
      }
    }

    return new ServiceUnavailableException(
      ROUTE_EXCEPTIONS.SERVICE_UNAVAILABLE,
    );
  }
}
