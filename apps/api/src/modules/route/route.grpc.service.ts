import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  ServiceUnavailableException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { ROUTE_EXCEPTIONS } from './constants';

/**
 * Interface para a requisição de rota
 */
interface RouteRequest {
  origin_lat: number;
  origin_lon: number;
  dest_lat: number;
  dest_lon: number;
}

/**
 * Interface para um ponto no caminho
 */
interface Point {
  lon: number;
  lat: number;
}

/**
 * Interface para as estatísticas da rota
 */
interface RouteStats {
  distance_meters: number;
  time_seconds: number;
  nodes_in_path: number;
  nodes_expanded: number;
}

/**
 * Interface para a resposta de rota
 */
interface RouteResponse {
  success: boolean;
  algorithm?: string;
  path?: Point[];
  stats?: RouteStats;
  error_message?: string;
  error_code?: string;
}

/**
 * Interface para a requisição de health check
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HealthCheckRequest {}

/**
 * Interface para a resposta de health check
 */
interface HealthCheckResponse {
  healthy: boolean;
  status: string;
  graph_loaded: boolean;
  graph_nodes: number;
  graph_edges: number;
}

/**
 * Interface para o cliente gRPC do serviço de rotas
 */
interface RouteServiceClient {
  CalculateRoute(
    request: RouteRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: RouteResponse,
    ) => void,
  ): grpc.ClientUnaryCall;

  HealthCheck(
    request: HealthCheckRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: HealthCheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

/**
 * Serviço de comunicação gRPC com o microsserviço de cálculo de rotas.
 */
@Injectable()
export class RouteGrpcService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RouteGrpcService.name);
  private client: RouteServiceClient;
  private readonly grpcUrl: string;
  private readonly requestDeadline: number;

  constructor(private readonly configService: ConfigService) {
    this.grpcUrl = this.configService.getOrThrow<string>('AI_GRPC_URL');
    this.requestDeadline = Number(
      this.configService.getOrThrow<string>('AI_SERVICE_TIMEOUT'),
    );
  }

  /**
   * Inicializa o cliente gRPC quando o módulo é iniciado
   */
  async onModuleInit() {
    const protoPath = join(__dirname, './proto/route.proto');

    // Carrega o arquivo .proto
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as any;

    // Cria o cliente gRPC
    this.client = new protoDescriptor.route.RouteService(
      this.grpcUrl,
      grpc.credentials.createInsecure(),
    ) as RouteServiceClient;

    this.logger.log(`Cliente gRPC conectado a ${this.grpcUrl}`);
  }

  /**
   * Fecha a conexão gRPC quando o módulo é destruído
   */
  async onModuleDestroy() {
    if (this.client) {
      grpc.closeClient(this.client as any);
      this.logger.log('Cliente gRPC desconectado');
    }
  }

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
    return new Promise((resolve, reject) => {
      const request: RouteRequest = {
        origin_lat: originLat,
        origin_lon: originLon,
        dest_lat: destLat,
        dest_lon: destLon,
      };

      // Define um deadline para a requisição
      const deadline = new Date();
      deadline.setMilliseconds(
        deadline.getMilliseconds() + this.requestDeadline,
      );

      const call = this.client.CalculateRoute(request, (error, response) => {
        if (error) {
          this.logger.error(
            `Erro gRPC ao calcular rota: ${error.message}`,
            error.stack,
          );
          reject(this.handleGrpcError(error));
          return;
        }

        if (!response.success) {
          reject(this.handleAiServiceError(response));
          return;
        }

        // Converte os pontos do formato gRPC para o formato esperado
        const path = (response.path || []).map((point) => [
          point.lon,
          point.lat,
        ]);

        resolve({
          status: 'success',
          algorithm: response.algorithm,
          path,
          stats: {
            distance_meters: response.stats?.distance_meters || 0,
            time_seconds: response.stats?.time_seconds || 0,
            nodes_in_path: response.stats?.nodes_in_path || 0,
            nodes_expanded: response.stats?.nodes_expanded || 0,
          },
        });
      });

      // Define o deadline na chamada usando deadline options
      (call as any).deadline = deadline;
    });
  }

  /**
   * Verifica o status de saúde do serviço de rotas.
   *
   * @returns {Promise<HealthCheckResponse>} O status de saúde do serviço.
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    return new Promise((resolve, reject) => {
      const request: HealthCheckRequest = {};

      const deadline = new Date();
      deadline.setMilliseconds(deadline.getMilliseconds() + 5000); // 5 segundos

      const call = this.client.HealthCheck(request, (error, response) => {
        if (error) {
          this.logger.error(
            `Erro gRPC ao verificar saúde: ${error.message}`,
            error.stack,
          );
          reject(this.handleGrpcError(error));
          return;
        }

        resolve(response);
      });

      (call as any).deadline = deadline;
    });
  }

  /**
   * Converte erros gRPC em exceções apropriadas do NestJS.
   *
   * @param {grpc.ServiceError} error O erro retornado pelo gRPC.
   * @returns {Error} A exceção apropriada para o tipo de erro.
   */
  private handleGrpcError(error: grpc.ServiceError): Error {
    if (
      error.code === grpc.status.UNAVAILABLE ||
      error.code === grpc.status.DEADLINE_EXCEEDED
    ) {
      return new ServiceUnavailableException(
        ROUTE_EXCEPTIONS.SERVICE_UNAVAILABLE,
      );
    }

    if (error.code === grpc.status.INVALID_ARGUMENT) {
      return new BadRequestException(
        ROUTE_EXCEPTIONS.INVALID_COORDINATES_FORMAT,
      );
    }

    return new ServiceUnavailableException(
      ROUTE_EXCEPTIONS.SERVICE_UNAVAILABLE,
    );
  }

  /**
   * Converte erros do microsserviço AI em exceções apropriadas do NestJS.
   *
   * @param {RouteResponse} response A resposta de erro do serviço.
   * @returns {Error} A exceção apropriada para o tipo de erro.
   */
  private handleAiServiceError(response: RouteResponse): Error {
    const errorCode = response.error_code;

    switch (errorCode) {
      case 'INVALID_FORMAT':
        return new BadRequestException(
          ROUTE_EXCEPTIONS.INVALID_COORDINATES_FORMAT,
        );
      case 'OUT_OF_RANGE_LATITUDE':
        return new BadRequestException(ROUTE_EXCEPTIONS.LATITUDE_OUT_OF_RANGE);
      case 'OUT_OF_RANGE_LONGITUDE':
        return new BadRequestException(ROUTE_EXCEPTIONS.LONGITUDE_OUT_OF_RANGE);
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
          response.error_message || ROUTE_EXCEPTIONS.ROUTE_CALCULATION_FAILED,
        );
    }
  }
}
