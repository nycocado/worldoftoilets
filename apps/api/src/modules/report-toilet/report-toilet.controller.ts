import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import {
  CreateReportToiletRequestDto,
  GetReportsToiletRequestDto,
  ReportToiletDetailResponseDto,
  ReportToiletListResponseDto,
  ReportToiletResponseDto,
} from './dto';
import {
  CreateReportToiletUseCase,
  GetReportsToiletUseCase,
  GetReportToiletDetailsUseCase,
  AcceptReportToiletUseCase,
  RejectReportToiletUseCase,
  ReturnReportToiletToPendingUseCase,
} from './use-cases';
import {
  ApiSwaggerCreateReportToilet,
  ApiSwaggerGetReportsToilet,
  ApiSwaggerGetReportToiletDetails,
  ApiSwaggerAcceptReportToilet,
  ApiSwaggerRejectReportToilet,
  ApiSwaggerReturnReportToiletToPending,
} from './swagger';
import { REPORT_TOILET_MESSAGES } from './constants';

/**
 * Gerencia as requisições HTTP para operações relacionadas a denúncias de casas de banho.
 */
@ApiTags('Report Toilet')
@Controller('report-toilet')
export class ReportToiletController {
  constructor(
    private readonly createUseCase: CreateReportToiletUseCase,
    private readonly getReportsUseCase: GetReportsToiletUseCase,
    private readonly getDetailsUseCase: GetReportToiletDetailsUseCase,
    private readonly acceptUseCase: AcceptReportToiletUseCase,
    private readonly rejectUseCase: RejectReportToiletUseCase,
    private readonly returnToPendingUseCase: ReturnReportToiletToPendingUseCase,
  ) {}

  /**
   * Cria uma denúncia de casa de banho.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateReportToiletRequestDto} dto Os dados da denúncia.
   * @returns {Promise<ApiResponseDto<ReportToiletResponseDto>>} A denúncia criada.
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REPORT_TOILETS)
  @ApiSwaggerCreateReportToilet()
  async createReportToilet(
    @User() user: jwtTypes.RequestUser,
    @Body() dto: CreateReportToiletRequestDto,
  ): Promise<ApiResponseDto<ReportToiletResponseDto>> {
    const result = await this.createUseCase.execute(
      user.publicId,
      dto.toiletPublicId,
      dto.typeReportToilet,
    );
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.CREATE_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Lista casas de banho denunciadas com agregações.
   *
   * @param {GetReportsToiletRequestDto} dto Os filtros de busca.
   * @returns {Promise<ApiResponseDto<ReportToiletListResponseDto[]>>} Lista de casas de banho denunciadas.
   */
  @Get('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_TOILETS)
  @ApiSwaggerGetReportsToilet()
  async getReportsToilet(
    @Query() dto: GetReportsToiletRequestDto,
  ): Promise<ApiResponseDto<ReportToiletListResponseDto[]>> {
    const result = await this.getReportsUseCase.execute(
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.status,
    );
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.GET_REPORTS_SUCCESS,
      result,
    );
  }

  /**
   * Obtém detalhes de denúncias de uma casa de banho específica.
   *
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @returns {Promise<ApiResponseDto<ReportToiletDetailResponseDto>>} Detalhes das denúncias.
   */
  @Get('manage/:toiletPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_TOILETS)
  @ApiSwaggerGetReportToiletDetails()
  async getReportToiletDetails(
    @Param('toiletPublicId') toiletPublicId: string,
  ): Promise<ApiResponseDto<ReportToiletDetailResponseDto>> {
    const result = await this.getDetailsUseCase.execute(toiletPublicId);
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.GET_REPORT_DETAILS_SUCCESS,
      result,
    );
  }

  /**
   * Aceita uma denúncia de casa de banho.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportToiletResponseDto>>} A denúncia aceite.
   */
  @Patch('manage/:publicId/accept')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_TOILETS)
  @ApiSwaggerAcceptReportToilet()
  async acceptReportToilet(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportToiletResponseDto>> {
    const result = await this.acceptUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.ACCEPT_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Rejeita uma denúncia de casa de banho.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportToiletResponseDto>>} A denúncia rejeitada.
   */
  @Patch('manage/:publicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_TOILETS)
  @ApiSwaggerRejectReportToilet()
  async rejectReportToilet(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportToiletResponseDto>> {
    const result = await this.rejectUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.REJECT_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportToiletResponseDto>>} A denúncia atualizada.
   */
  @Patch('manage/:publicId/pending')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_TOILETS)
  @ApiSwaggerReturnReportToiletToPending()
  async returnReportToiletToPending(
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportToiletResponseDto>> {
    const result = await this.returnToPendingUseCase.execute(publicId);
    return new ApiResponseDto(
      REPORT_TOILET_MESSAGES.RETURN_TO_PENDING_SUCCESS,
      result,
    );
  }
}
