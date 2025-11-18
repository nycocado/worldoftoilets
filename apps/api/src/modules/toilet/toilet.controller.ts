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
 * Controlador de Toilets
 *
 * @class ToiletController
 * @description Controlador que expõe endpoints HTTP para operações de toilets.
 * Processa requests, valida DTOs, aplica guards de autenticação e permissões,
 * e delega lógica de negócio para os use cases apropriados.
 *
 * @route /toilet - Rota base para todos os endpoints de toilets
 *
 * @endpoints
 * - GET /toilet - Listar toilets ativos
 * - GET /toilet/manage - Listar todos toilets (gestão)
 * - GET /toilet/bounding-box - Obter toilets por área geográfica
 * - GET /toilet/proximity - Obter toilets por proximidade
 * - GET /toilet/:publicId - Obter toilet por ID
 * - PUT /toilet/:publicId/view - Registar visualização de toilet
 * - POST /toilet/manage - Criar novo toilet
 * - PATCH /toilet/:publicId/manage - Atualizar toilet
 * - DELETE /toilet/:publicId/manage - Deletar toilet (soft delete)
 * - PUT /toilet/:publicId/manage/undelete - Recuperar toilet deletado
 * - PUT /toilet/:publicId/manage/publish - Publicar toilet sugerido
 * - PUT /toilet/:publicId/manage/disable - Desativar toilet
 * - PUT /toilet/:publicId/manage/enable - Ativar toilet
 * - POST /toilet/:publicId/manage/image - Upload de imagem do toilet
 *
 * @see GetToiletByPublicIdUseCase, GetToiletsUseCase - Use cases de listagem
 * @see CreateToiletUseCase, UpdateToiletUseCase, DeleteToiletUseCase - Use cases principais
 * @see PublishToiletUseCase, DisableToiletUseCase, EnableToiletUseCase - Use cases de gestão
 * @see UploadToiletImageUseCase, ViewToiletUseCase - Use cases auxiliares
 */
@ApiTags('Toilet')
@Controller('toilet')
export class ToiletController {
  /**
   * Construtor do ToiletController
   *
   * @param {GetToiletByPublicIdUseCase} getToiletsByPublicIdUseCase - Use case para obter por ID
   * @param {GetToiletsUseCase} getToiletsUseCase - Use case para listar toilets
   * @param {GetToiletsByBoundingBoxUseCase} getToiletsByBoundingBoxUseCase - Use case para busca por área
   * @param {GetToiletsByProximityUseCase} getToiletsByProximityUseCase - Use case para busca por proximidade
   * @param {CreateToiletUseCase} createToiletUseCase - Use case para criar toilet
   * @param {UpdateToiletUseCase} updateToiletUseCase - Use case para atualizar toilet
   * @param {DeleteToiletUseCase} deleteToiletUseCase - Use case para deletar toilet
   * @param {UndeleteToiletUseCase} undeleteToiletUseCase - Use case para recuperar toilet
   * @param {PublishToiletUseCase} publishToiletUseCase - Use case para publicar toilet
   * @param {DisableToiletUseCase} disableToiletUseCase - Use case para desativar toilet
   * @param {EnableToiletUseCase} enableToiletUseCase - Use case para ativar toilet
   * @param {ViewToiletUseCase} viewToiletUseCase - Use case para registar visualização
   * @param {UploadToiletImageUseCase} uploadToiletImageUseCase - Use case para upload de imagem
   */
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
   * Listar toilets ativos
   *
   * @async
   * @route GET /toilet
   * @protected Requer autenticação JWT e permissão VIEW_TOILETS
   * @param {GetToiletsRequestDto} getToiletsRequestDto - Parâmetros de paginação e filtros.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} Lista de toilets ativos que correspondem aos filtros.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_TOILETS.
   *
   * @description
   * Retorna uma lista de toilets com status ATIVO.
   * Suporta paginação e múltiplos filtros, como localização (cidade, país), tipo de acesso e extras.
   */
  @ApiSwaggerGetToilets()
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

  /**
   * Listar todos os toilets para gestão
   *
   * @async
   * @route GET /toilet/manage
   * @protected Requer autenticação JWT e permissão VIEW_ALL_TOILETS
   * @param {GetToiletsManageRequestDto} getToiletsRequestDto - Parâmetros de paginação e filtros, incluindo status.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} Lista de todos os toilets que correspondem aos filtros.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_ALL_TOILETS.
   *
   * @description
   * Retorna uma lista de toilets para fins de gestão, permitindo filtrar por qualquer status (ATIVO, INATIVO, SUGERIDO).
   * Suporta os mesmos filtros que a rota pública, com a adição do filtro de status.
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
   * Obter toilets por área geográfica (bounding box)
   *
   * @async
   * @route GET /toilet/bounding-box
   * @protected Requer autenticação JWT e permissão VIEW_TOILETS
   * @param {GetToiletsBoundingBoxRequestDto} boundingBoxDto - Coordenadas da área de busca e filtros.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} Lista de toilets ativos dentro da área especificada.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_TOILETS.
   *
   * @description
   * Retorna todos os toilets ativos localizados dentro de um retângulo geográfico definido por coordenadas mínimas e máximas.
   * Utilizado para buscas em mapas.
   */
  @ApiSwaggerGetToiletsBoundingBox()
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

  /**
   * Obter toilets por proximidade
   *
   * @async
   * @route GET /toilet/proximity
   * @protected Requer autenticação JWT e permissão VIEW_TOILETS
   * @param {GetToiletsProximityRequestDto} proximityDto - Coordenadas do ponto de referência e filtros.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto[]>>} Lista de toilets ativos ordenados por proximidade.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_TOILETS.
   *
   * @description
   * Retorna uma lista de toilets ativos, ordenados do mais próximo ao mais distante de um ponto geográfico (latitude, longitude) fornecido.
   * Suporta paginação.
   */
  @ApiSwaggerGetToiletsProximity()
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

  /**
   * Obter um toilet por ID público
   *
   * @async
   * @route GET /toilet/:publicId
   * @protected Requer autenticação JWT e permissão VIEW_TOILETS
   * @param {string} publicId - O ID público do toilet.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados detalhados do toilet.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_TOILETS.
   *
   * @description
   * Retorna os dados completos de um único toilet, identificado pelo seu ID público.
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
   * Registrar visualização de um toilet
   *
   * @async
   * @route PUT /toilet/:publicId/view
   * @protected Requer autenticação JWT e permissão VIEW_TOILETS
   * @param {string} publicId - O ID público do toilet visualizado.
   * @param {jwtTypes.RequestUser} user - O usuário autenticado que realizou a visualização.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão VIEW_TOILETS.
   *
   * @description
   * Cria uma interação do tipo 'VIEW' para registrar que um usuário visualizou a página de detalhes de um toilet.
   * Esta ação é "fire-and-forget" e não retorna dados.
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
   * Criar um novo toilet
   *
   * @async
   * @route POST /toilet/manage
   * @protected Requer autenticação JWT e permissão CREATE_TOILETS
   * @param {CreateToiletRequestDto} createToiletDto - Os dados para a criação do novo toilet.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados do toilet recém-criado.
   * @throws {BadRequestException} Se os dados fornecidos forem inválidos (ex: país não reconhecido).
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão CREATE_TOILETS.
   *
   * @description
   * Cria um novo toilet no sistema com status ATIVO.
   * Este endpoint é destinado para administradores ou usuários com permissões de criação.
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
   * Atualizar um toilet
   *
   * @async
   * @route PATCH /toilet/:publicId/manage
   * @protected Requer autenticação JWT e permissão EDIT_TOILETS
   * @param {string} publicId - O ID público do toilet a ser atualizado.
   * @param {UpdateToiletRequestDto} updateToiletDto - Os dados a serem atualizados. Apenas campos fornecidos serão alterados.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados do toilet atualizado.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão EDIT_TOILETS.
   *
   * @description
   * Atualiza as informações de um toilet existente. Apenas os campos presentes no corpo da requisição são modificados.
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
   * Deletar um toilet (soft delete)
   *
   * @async
   * @route DELETE /toilet/:publicId/manage
   * @protected Requer autenticação JWT e permissão DELETE_TOILETS
   * @param {string} publicId - O ID público do toilet a ser deletado.
   * @param {jwtTypes.RequestUser} user - O usuário autenticado que está realizando a deleção.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet já estiver deletado ou for uma sugestão.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão DELETE_TOILETS.
   *
   * @description
   * Realiza um "soft delete" em um toilet, marcando-o como deletado em vez de removê-lo permanentemente.
   * A operação não é permitida em toilets com status SUGERIDO.
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
   * Recuperar um toilet deletado
   *
   * @async
   * @route PUT /toilet/:publicId/manage/undelete
   * @protected Requer autenticação JWT e permissão UNDELETE_TOILETS
   * @param {string} publicId - O ID público do toilet a ser recuperado.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet não estiver deletado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão UNDELETE_TOILETS.
   *
   * @description
   * Reverte a operação de "soft delete", tornando o toilet novamente acessível.
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
   * Publicar um toilet sugerido
   *
   * @async
   * @route PUT /toilet/:publicId/manage/publish
   * @protected Requer autenticação JWT e permissão PUBLISH_TOILETS
   * @param {string} publicId - O ID público do toilet a ser publicado.
   * @param {jwtTypes.RequestUser} user - O usuário autenticado que está realizando a publicação.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado ou não estiver com o status 'SUGGESTED'.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão PUBLISH_TOILETS.
   *
   * @description
   * Altera o status de um toilet de 'SUGGESTED' para 'ACTIVE', tornando-o visível publicamente.
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
   * Desativar um toilet
   *
   * @async
   * @route PUT /toilet/:publicId/manage/disable
   * @protected Requer autenticação JWT e permissão DISABLE_TOILETS
   * @param {string} publicId - O ID público do toilet a ser desativado.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados do toilet atualizado.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão DISABLE_TOILETS.
   *
   * @description
   * Altera o status de um toilet para 'INACTIVE'. O toilet permanece no sistema, mas não é retornado em buscas públicas.
   * A operação é idempotente; chamar em um toilet já inativo não causa erro.
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
   * Ativar um toilet
   *
   * @async
   * @route PUT /toilet/:publicId/manage/enable
   * @protected Requer autenticação JWT e permissão ENABLE_TOILETS
   * @param {string} publicId - O ID público do toilet a ser ativado.
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados do toilet atualizado.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão ENABLE_TOILETS.
   *
   * @description
   * Altera o status de um toilet para 'ACTIVE'.
   * A operação é idempotente; chamar em um toilet já ativo não causa erro.
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
   * Upload de imagem do toilet
   *
   * @async
   * @route POST /toilet/:publicId/manage/image
   * @protected Requer autenticação JWT e permissão EDIT_TOILETS
   * @param {string} publicId - O ID público do toilet para o qual a imagem será enviada.
   * @param {Express.Multer.File} file - O arquivo de imagem (multipart/form-data).
   * @returns {Promise<ApiResponseDto<ToiletResponseDto>>} Os dados do toilet atualizado com a nova URL da imagem.
   * @throws {NotFoundException} Se o toilet não for encontrado.
   * @throws {ConflictException} Se o toilet estiver deletado.
   * @throws {BadRequestException} Se o arquivo não for uma imagem válida ou exceder o tamanho limite.
   * @throws {UnauthorizedException} Se o token de autenticação for inválido ou ausente.
   * @throws {ForbiddenException} Se o usuário não possuir a permissão EDIT_TOILETS.
   *
   * @description
   * Faz o upload de uma imagem para um toilet. A imagem é armazenada e a URL pública é associada ao toilet.
   * Se uma imagem anterior existir, ela é substituída.
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
