import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  CreateToiletRequestDto,
  GetToiletsBoundingBoxRequestDto,
  GetToiletsProximityRequestDto,
  GetToiletsRequestDto,
  ToiletResponseDto,
  UpdateToiletRequestDto,
} from '@modules/toilet/dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName, ToiletStatus } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { TOILET_MESSAGES } from '@modules/toilet/constants/messages.constant';
import {
  CreateToiletUseCase,
  DeleteToiletUseCase,
  DisableToiletUseCase,
  EnableToiletUseCase,
  GetToiletByPublicIdUseCase,
  GetToiletsByBoundingBoxUseCase,
  GetToiletsByProximityUseCase,
  GetToiletsUseCase,
  PublishToiletUseCase,
  UndeleteToiletUseCase,
  UpdateToiletUseCase,
} from '@modules/toilet/use-cases';
import { GetToiletsManageRequestDto } from '@modules/toilet/dto/get-toilets-manage-request.dto';

@Controller('toilet')
export class ToiletController {
  constructor(
    private readonly getToiletsByPublicIdUseCase: GetToiletByPublicIdUseCase,
    private readonly getToiletsUseCase: GetToiletsUseCase,
    private readonly getToiletsByBoundingBoxUseCase: GetToiletsByBoundingBoxUseCase,
    private readonly getToiletsByProximityUseCase: GetToiletsByProximityUseCase,
    private readonly createToiletUseCase: CreateToiletUseCase,
    private readonly updateToiletUseCase: UpdateToiletUseCase,
    private readonly deleteToiletUseCase: DeleteToiletUseCase,
    private readonly undeleteToiletUseCase: UndeleteToiletUseCase,
    private readonly publishToiletUseCase: PublishToiletUseCase,
    private readonly disableToiletUseCase: DisableToiletUseCase,
    private readonly enableToiletUseCase: EnableToiletUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('')
  async getToilets(
    @Query() getToiletsRequestDto: GetToiletsRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const {
      pageable,
      page,
      size,
      city,
      country,
      countryCode,
      access,
      extras,
      timestamp,
    } = getToiletsRequestDto || {};

    const result = await this.getToiletsUseCase.execute(
      city,
      country,
      countryCode,
      access,
      ToiletStatus.ACTIVE,
      timestamp,
      pageable,
      page,
      size,
      extras,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_TOILETS)
  @Get('manage')
  async getToiletsManage(
    @Query() getToiletsRequestDto: GetToiletsManageRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const {
      pageable,
      page,
      size,
      city,
      country,
      countryCode,
      access,
      extras,
      status,
      timestamp,
    } = getToiletsRequestDto || {};

    const result = await this.getToiletsUseCase.execute(
      city,
      country,
      countryCode,
      access,
      status,
      timestamp,
      pageable,
      page,
      size,
      extras,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILET_MANAGE_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('bounding-box')
  async getToiletsByBoundingBox(
    @Query() boundingBoxDto: GetToiletsBoundingBoxRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto[]>> {
    const { minLat, minLng, maxLat, maxLng, access, extras, timestamp } =
      boundingBoxDto;

    const result = await this.getToiletsByBoundingBoxUseCase.execute(
      minLat,
      minLng,
      maxLat,
      maxLng,
      access,
      ToiletStatus.ACTIVE,
      timestamp,
      extras,
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
    const { lat, lng, pageable, page, size, access, timestamp, extras } =
      proximityDto;

    const result = await this.getToiletsByProximityUseCase.execute(
      lat,
      lng,
      access,
      ToiletStatus.ACTIVE,
      timestamp,
      pageable,
      page,
      size,
      extras,
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.CREATE_TOILETS)
  @Post('manage')
  async createToilet(
    @Body() createToiletDto: CreateToiletRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const {
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      placeId,
      extras,
    } = createToiletDto;

    const result = await this.createToiletUseCase.execute(
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      placeId,
      extras,
    );

    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.CREATE_TOILET_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_TOILETS)
  @Patch(':publicId/manage')
  async updateToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() updateToiletDto: UpdateToiletRequestDto,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const {
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      placeId,
      extras,
    } = updateToiletDto;

    const result = await this.updateToiletUseCase.execute(
      publicId,
      access,
      name,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      placeId,
      extras,
    );

    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.UPDATE_TOILET_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_TOILETS)
  @Delete(':publicId/manage')
  async deleteToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteToiletUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(TOILET_MESSAGES.DELETE_TOILET_SUCCESS);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.UNDELETE_TOILETS)
  @Put(':publicId/manage/undelete')
  async undeleteToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto> {
    await this.undeleteToiletUseCase.execute(publicId);
    return new ApiResponseDto(TOILET_MESSAGES.UNDELETE_TOILET_SUCCESS);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.PUBLISH_TOILETS)
  @Put(':publicId/manage/publish')
  async publishToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.publishToiletUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(TOILET_MESSAGES.PUBLISH_TOILET_SUCCESS);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DISABLE_TOILETS)
  @Put(':publicId/manage/disable')
  async disableToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const result = await this.disableToiletUseCase.execute(publicId);
    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.DISABLE_TOILET_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.ENABLE_TOILETS)
  @Put(':publicId/manage/enable')
  async enableToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const result = await this.enableToiletUseCase.execute(publicId);
    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.ENABLE_TOILET_SUCCESS,
      result,
    );
  }
}
