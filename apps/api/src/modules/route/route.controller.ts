import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import {
  CalculateRouteUseCase,
  CalculateRouteToToiletUseCase,
} from './use-cases';
import {
  CalculateRouteRequestDto,
  OriginCoordinatesRequestDto,
  RouteResponseDto,
} from './dto';
import { ROUTE_MESSAGES } from './constants';
import {
  ApiSwaggerCalculateRoute,
  ApiSwaggerCalculateRouteToToilet,
} from './swagger';

/**
 * Gerencia as requisições HTTP para operações de cálculo de rotas.
 */
@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(
    private readonly calculateRouteUseCase: CalculateRouteUseCase,
    private readonly calculateRouteToToiletUseCase: CalculateRouteToToiletUseCase,
  ) {}

  /**
   * Calcula uma rota entre dois pontos geográficos.
   *
   * @param {CalculateRouteRequestDto} query Os dados da requisição com coordenadas de origem e destino.
   * @returns {Promise<ApiResponseDto<RouteResponseDto>>} A rota calculada com estatísticas.
   * @throws {BadRequestException} Se as coordenadas forem inválidas ou fora da área de serviço.
   * @throws {ServiceUnavailableException} Se o serviço de rotas estiver indisponível.
   */
  @Get('calculate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.ROUTE_TOILETS)
  @ApiSwaggerCalculateRoute()
  async calculateRoute(
    @Query() query: CalculateRouteRequestDto,
  ): Promise<ApiResponseDto<RouteResponseDto>> {
    const { originLat, originLon, destLat, destLon } = query;

    const route = await this.calculateRouteUseCase.execute(
      originLat,
      originLon,
      destLat,
      destLon,
    );

    return new ApiResponseDto(ROUTE_MESSAGES.CALCULATE_ROUTE_SUCCESS, route);
  }

  /**
   * Calcula uma rota desde a origem até um toilet específico.
   *
   * @param {string} publicId O identificador público do toilet de destino.
   * @param {OriginCoordinatesRequestDto} query Os dados da requisição com coordenadas de origem.
   * @returns {Promise<ApiResponseDto<RouteResponseDto>>} A rota calculada com estatísticas.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {BadRequestException} Se as coordenadas forem inválidas ou fora da área de serviço.
   * @throws {ServiceUnavailableException} Se o serviço de rotas estiver indisponível.
   */
  @Get('calculate/toilet/:publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.ROUTE_TOILETS)
  @ApiSwaggerCalculateRouteToToilet()
  async calculateRouteToToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Query() query: OriginCoordinatesRequestDto,
  ): Promise<ApiResponseDto<RouteResponseDto>> {
    const { originLat, originLon } = query;

    const route = await this.calculateRouteToToiletUseCase.execute(
      originLat,
      originLon,
      publicId,
    );

    return new ApiResponseDto(ROUTE_MESSAGES.CALCULATE_ROUTE_SUCCESS, route);
  }
}
