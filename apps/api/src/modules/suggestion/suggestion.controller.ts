import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  CreateSuggestionRequestDto,
  GetSuggestionsRequestDto,
  SuggestionResponseDto,
} from '@modules/suggestion/dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { SUGGESTION_MESSAGES } from '@modules/suggestion/constants/messages.constant';
import {
  CreateSuggestionUseCase,
  GetSuggestionsUseCase,
  GetSuggestionByPublicIdUseCase,
  GetSuggestionsByUserUseCase,
  AcceptSuggestionUseCase,
  RejectSuggestionUseCase,
  SetPendingSuggestionUseCase,
  UploadSuggestionImageUseCase,
  PublishSuggestionImageUseCase,
} from '@modules/suggestion/use-cases';
import {
  ApiSwaggerCreateSuggestion,
  ApiSwaggerUploadSuggestionImage,
  ApiSwaggerGetSuggestions,
  ApiSwaggerGetSuggestion,
  ApiSwaggerGetSuggestionsManage,
  ApiSwaggerAcceptSuggestion,
  ApiSwaggerRejectSuggestion,
  ApiSwaggerPendingSuggestion,
  ApiSwaggerPublishSuggestionImage,
} from '@modules/suggestion/swagger';

@ApiTags('Suggestion')
@Controller('suggestion')
export class SuggestionController {
  constructor(
    private readonly createSuggestionUseCase: CreateSuggestionUseCase,
    private readonly getSuggestionsUseCase: GetSuggestionsUseCase,
    private readonly getSuggestionByPublicIdUseCase: GetSuggestionByPublicIdUseCase,
    private readonly getSuggestionsByUserUseCase: GetSuggestionsByUserUseCase,
    private readonly acceptSuggestionUseCase: AcceptSuggestionUseCase,
    private readonly rejectSuggestionUseCase: RejectSuggestionUseCase,
    private readonly setPendingSuggestionUseCase: SetPendingSuggestionUseCase,
    private readonly uploadSuggestionImageUseCase: UploadSuggestionImageUseCase,
    private readonly publishSuggestionImageUseCase: PublishSuggestionImageUseCase,
  ) {}

  @ApiSwaggerCreateSuggestion()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SUGGEST_TOILETS)
  @Post('')
  async createSuggestion(
    @Body() createSuggestionDto: CreateSuggestionRequestDto,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const { latitude, longitude, toilet } = createSuggestionDto;
    const { access, name, address, city, state, country, placeId, extras } =
      toilet;

    const result = await this.createSuggestionUseCase.execute(
      user.publicId,
      latitude,
      longitude,
      access,
      name,
      address,
      city,
      state,
      country,
      placeId,
      extras,
    );

    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.CREATE_SUGGESTION_SUCCESS,
      result,
    );
  }

  @ApiSwaggerUploadSuggestionImage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SUGGEST_TOILETS)
  @Post(':publicId/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /image\/(jpeg|jpg|png|webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.uploadSuggestionImageUseCase.execute(
      publicId,
      file,
    );
    return new ApiResponseDto<SuggestionResponseDto>(
      'Image uploaded successfully.',
      result,
    );
  }

  @ApiSwaggerGetSuggestions()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SUGGEST_TOILETS)
  @Get('/user/self')
  async getSuggestionsBySelfUser(
    @Query() getSuggestionsRequestDto: GetSuggestionsRequestDto,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<SuggestionResponseDto[]>> {
    const { pageable, page, size, status } = getSuggestionsRequestDto || {};

    const result = await this.getSuggestionsByUserUseCase.execute(
      user.publicId,
      status,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<SuggestionResponseDto[]>(
      SUGGESTION_MESSAGES.GET_SUGGESTIONS_SUCCESS,
      result,
    );
  }

  @ApiSwaggerGetSuggestion()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SUGGEST_TOILETS)
  @Get(':publicId/manage')
  async getSuggestionByPublicId(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.getSuggestionByPublicIdUseCase.execute(publicId);
    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.GET_SUGGESTION_SUCCESS,
      result,
    );
  }

  @ApiSwaggerGetSuggestionsManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_SUGGEST_TOILETS)
  @Get('manage')
  async getSuggestionsManage(
    @Query() getSuggestionsRequestDto: GetSuggestionsRequestDto,
  ): Promise<ApiResponseDto<SuggestionResponseDto[]>> {
    const { pageable, page, size, status } = getSuggestionsRequestDto || {};

    const result = await this.getSuggestionsUseCase.execute(
      status,
      pageable,
      page,
      size,
    );

    return new ApiResponseDto<SuggestionResponseDto[]>(
      SUGGESTION_MESSAGES.GET_SUGGESTIONS_MANAGE_SUCCESS,
      result,
    );
  }

  @ApiSwaggerAcceptSuggestion()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_SUGGEST_TOILETS)
  @Put(':publicId/manage/accept')
  async acceptSuggestion(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.acceptSuggestionUseCase.execute(
      publicId,
      user.publicId,
    );
    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.ACCEPT_SUGGESTION_SUCCESS,
      result,
    );
  }

  @ApiSwaggerRejectSuggestion()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_SUGGEST_TOILETS)
  @Put(':publicId/manage/reject')
  async rejectSuggestion(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.rejectSuggestionUseCase.execute(
      publicId,
      user.publicId,
    );
    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.REJECT_SUGGESTION_SUCCESS,
      result,
    );
  }

  @ApiSwaggerPendingSuggestion()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_SUGGEST_TOILETS)
  @Put(':publicId/manage/pending')
  async setPendingSuggestion(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.setPendingSuggestionUseCase.execute(publicId);
    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.PENDING_SUGGESTION_SUCCESS,
      result,
    );
  }

  @ApiSwaggerPublishSuggestionImage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_SUGGEST_TOILETS)
  @Post(':publicId/manage/image/publish')
  async publishSuggestionImage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<SuggestionResponseDto>> {
    const result = await this.publishSuggestionImageUseCase.execute(publicId);
    return new ApiResponseDto<SuggestionResponseDto>(
      SUGGESTION_MESSAGES.PUBLISH_IMAGE_SUCCESS,
      result,
    );
  }
}
