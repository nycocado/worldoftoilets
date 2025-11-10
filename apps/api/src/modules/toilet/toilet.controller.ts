import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ToiletService } from './toilet.service';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  GetToiletsBoundingBoxRequestDto,
  GetToiletsProximityRequestDto,
  GetToiletsRequestDto,
  SearchToiletsRequestDto,
  SearchToiletResponseDto,
  ToiletResponseDto,
} from '@modules/toilet/dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import { TOILET_MESSAGES } from '@modules/toilet/constants/messages.constant';

@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('')
  async getToilets(
    @Query() getToiletsRequestDto: GetToiletsRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const { city, country, access, status, timestamp, pageable, page, size } =
      getToiletsRequestDto || {};

    const result = await this.toiletService.getToilets(
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

    const result = await this.toiletService.getByBoundingBox(
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

    const result = await this.toiletService.getByProximity(
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
  @RequiresPermissions(PermissionApiName.SEARCH_TOILETS)
  @Get('search')
  async searchToilets(
    @Query() searchDto: SearchToiletsRequestDto,
  ): Promise<ApiResponseDto<SearchToiletResponseDto[]>> {
    const { query, pageable, page, size } = searchDto;

    const result = await this.toiletService.getByFullTextSearch(
      query,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<SearchToiletResponseDto[]>(
      TOILET_MESSAGES.SEARCH_TOILETS_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get(':publicId')
  async getToiletByPublicId(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const result = await this.toiletService.getToiletByPublicId(publicId);
    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.GET_TOILET_SUCCESS,
      result,
    );
  }
}
