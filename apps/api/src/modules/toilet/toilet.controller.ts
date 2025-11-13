import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  GetToiletsBoundingBoxRequestDto,
  GetToiletsProximityRequestDto,
  GetToiletsRequestDto,
  ToiletResponseDto,
} from '@modules/toilet/dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import { TOILET_MESSAGES } from '@modules/toilet/constants/messages.constant';
import { GetToiletByPublicIdUseCase } from '@modules/toilet/use-cases/get-toilet-by-public-id.use.case';
import { GetToiletsUseCase } from '@modules/toilet/use-cases/get-toilets.use.case';
import { GetToiletsByBoundingBoxUseCase } from '@modules/toilet/use-cases/get-toilets-by-bounding-box.use-case';
import { GetToiletsByProximityUseCase } from '@modules/toilet/use-cases/get-toilets-by-proximity.use-case';

@Controller('toilet')
export class ToiletController {
  constructor(
    private readonly getToiletsByPublicIdUseCase: GetToiletByPublicIdUseCase,
    private readonly getToiletsUseCase: GetToiletsUseCase,
    private readonly getToiletsByBoundingBoxUseCase: GetToiletsByBoundingBoxUseCase,
    private readonly getToiletsByProximityUseCase: GetToiletsByProximityUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('')
  async getToilets(
    @Query() getToiletsRequestDto: GetToiletsRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const { city, country, access, status, timestamp, pageable, page, size } =
      getToiletsRequestDto || {};

    const result = await this.getToiletsUseCase.execute(
      city,
      country,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('bounding-box')
  async getToiletsByBoundingBox(
    @Query() boundingBoxDto: GetToiletsBoundingBoxRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const {
      minLat,
      minLng,
      maxLat,
      maxLng,
      city,
      country,
      access,
      status,
      timestamp,
    } = boundingBoxDto;

    const result = await this.getToiletsByBoundingBoxUseCase.execute(
      minLat,
      minLng,
      maxLat,
      maxLng,
      city,
      country,
      access,
      status,
      timestamp,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_BOUNDING_BOX_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('proximity')
  async getToiletsByProximity(
    @Query() proximityDto: GetToiletsProximityRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const {
      lat,
      lng,
      city,
      country,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
    } = proximityDto;

    const result = await this.getToiletsByProximityUseCase.execute(
      lat,
      lng,
      city,
      country,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_PROXIMITY_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get(':publicId')
  async getToiletByPublicId(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const result = await this.getToiletsByPublicIdUseCase.execute(publicId);
    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.GET_TOILET_SUCCESS,
      result,
    );
  }
}
