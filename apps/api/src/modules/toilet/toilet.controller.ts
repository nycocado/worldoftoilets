import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  UploadToiletImageUseCase,
} from '@modules/toilet/use-cases';
import { GetToiletsManageRequestDto } from '@modules/toilet/dto/get-toilets-manage-request.dto';
import { ViewToiletUseCase } from '@modules/toilet/use-cases/view-toilet.use-case';
import {
  ApiSwaggerCreateToilet,
  ApiSwaggerUpdateToilet,
  ApiSwaggerDeleteToilet,
  ApiSwaggerGetToilet,
  ApiSwaggerGetToilets,
  ApiSwaggerGetToiletsManage,
  ApiSwaggerGetToiletsBoundingBox,
  ApiSwaggerGetToiletsProximity,
  ApiSwaggerViewToilet,
  ApiSwaggerUndeleteToilet,
  ApiSwaggerPublishToilet,
  ApiSwaggerDisableToilet,
  ApiSwaggerEnableToilet,
  ApiSwaggerUploadToiletImage,
} from '@modules/toilet/swagger';
import { ApiTags } from '@nestjs/swagger';

/**
 * Gerencia as requisições HTTP para operações relacionadas a casas de banho.
 */
@ApiTags('Toilet')
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
    private readonly viewToiletUseCase: ViewToiletUseCase,
    private readonly uploadToiletImageUseCase: UploadToiletImageUseCase,
  ) {}

  /**
   * Lista casas de banho ativas com filtros opcionais e paginação.
   *
   * @param {GetToiletsRequestDto} getToiletsRequestDto Os parâmetros de paginação e filtros.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} A lista de casas de banho ativas.
   */
  @ApiSwaggerGetToilets()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('')
  async getToilets(
    @Query() getToiletsRequestDto: GetToiletsRequestDto,
    @User() user: jwtTypes.RequestUser,
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
      user.publicId,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_SUCCESS,
      result,
    );
  }

  /**
   * Lista todas as casas de banho para fins de gestão, com filtros e paginação.
   *
   * @param {GetToiletsManageRequestDto} getToiletsRequestDto Os parâmetros de paginação e filtros.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} A lista de todas as casas de banho.
   */
  @ApiSwaggerGetToiletsManage()
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

  /**
   * Obtém casas de banho por uma área geográfica definida (bounding box).
   *
   * @param {GetToiletsBoundingBoxRequestDto} boundingBoxDto As coordenadas da área de busca e filtros.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} A lista de casas de banho na área especificada.
   */
  @ApiSwaggerGetToiletsBoundingBox()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('bounding-box')
  async getToiletsByBoundingBox(
    @Query() boundingBoxDto: GetToiletsBoundingBoxRequestDto,
    @User() user: jwtTypes.RequestUser,
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
      user.publicId,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_BOUNDING_BOX_SUCCESS,
      result,
    );
  }

  /**
   * Obtém casas de banho ordenadas por proximidade a um ponto geográfico.
   *
   * @param {GetToiletsProximityRequestDto} proximityDto As coordenadas do ponto de referência e filtros.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} A lista de casas de banho ordenadas por proximidade.
   */
  @ApiSwaggerGetToiletsProximity()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Get('proximity')
  async getToiletsByProximity(
    @Query() proximityDto: GetToiletsProximityRequestDto,
    @User() user: jwtTypes.RequestUser,
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
      user.publicId,
    );

    return new ApiResponseDto<ToiletResponseDto[]>(
      TOILET_MESSAGES.GET_TOILETS_PROXIMITY_SUCCESS,
      result,
    );
  }

  /**
   * Obtém uma casa de banho específica pelo seu ID público.
   *
   * @param {string} publicId O ID público da casa de banho.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados detalhados da casa de banho.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   */
  @ApiSwaggerGetToilet()
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

  /**
   * Registra a visualização de uma casa de banho por um utilizador.
   *
   * @param {string} publicId O ID público da casa de banho visualizada.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado que visualizou.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a casa de banho não for encontrada ou estiver deletada.
   */
  @ApiSwaggerViewToilet()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_TOILETS)
  @Put(':publicId/view')
  async viewToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.viewToiletUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(TOILET_MESSAGES.VIEW_TOILET_SUCCESS);
  }

  /**
   * Cria uma nova casa de banho no sistema.
   *
   * @param {CreateToiletRequestDto} createToiletDto Os dados para a criação da casa de banho.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados da casa de banho recém-criada.
   * @throws {BadRequestException} Se o código do país fornecido for inválido.
   */
  @ApiSwaggerCreateToilet()
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

  /**
   * Atualiza as informações de uma casa de banho existente.
   *
   * @param {string} publicId O ID público da casa de banho a ser atualizada.
   * @param {UpdateToiletRequestDto} updateToiletDto Os dados a serem atualizados.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados da casa de banho atualizada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   */
  @ApiSwaggerUpdateToilet()
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

  /**
   * Realiza o soft delete de uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho a ser deletada.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado que está realizando a deleção.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho já estiver deletada.
   */
  @ApiSwaggerDeleteToilet()
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

  /**
   * Reverte o soft delete de uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho a ser recuperada.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho não estiver deletada.
   */
  @ApiSwaggerUndeleteToilet()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.UNDELETE_TOILETS)
  @Put(':publicId/manage/undelete')
  async undeleteToilet(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto> {
    await this.undeleteToiletUseCase.execute(publicId);
    return new ApiResponseDto(TOILET_MESSAGES.UNDELETE_TOILET_SUCCESS);
  }

  /**
   * Publica uma casa de banho sugerida.
   *
   * @param {string} publicId O ID público da casa de banho a ser publicada.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado que está realizando a publicação.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada ou não estiver no estado sugerido.
   */
  @ApiSwaggerPublishToilet()
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

  /**
   * Desativa uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho a ser desativada.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados da casa de banho atualizada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   */
  @ApiSwaggerDisableToilet()
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

  /**
   * Ativa uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho a ser ativada.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados da casa de banho atualizada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   */
  @ApiSwaggerEnableToilet()
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

  /**
   * Realiza o upload de uma imagem para uma casa de banho.
   *
   * @param {string} publicId O ID público da casa de banho para a qual a imagem será enviada.
   * @param {Express.Multer.File} file O arquivo de imagem.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados da casa de banho atualizada com a nova URL da imagem.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho estiver deletada.
   * @throws {BadRequestException} Se a imagem exceder o tamanho máximo de 5MB.
   */
  @ApiSwaggerUploadToiletImage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_TOILETS)
  @Post(':publicId/manage/image')
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
  ): Promise<ApiResponseDto<ToiletResponseDto>> {
    const result = await this.uploadToiletImageUseCase.execute(publicId, file);
    return new ApiResponseDto<ToiletResponseDto>(
      TOILET_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      result,
    );
  }
}
