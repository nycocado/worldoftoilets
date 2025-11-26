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
  CreateReportUserRequestDto,
  GetReportsUserRequestDto,
  ReportUserDetailResponseDto,
  ReportUserListResponseDto,
  ReportUserResponseDto,
} from './dto';
import {
  CreateReportUserUseCase,
  GetReportsUserUseCase,
  GetReportUserDetailsUseCase,
  AcceptReportUserUseCase,
  RejectReportUserUseCase,
  ReturnReportUserToPendingUseCase,
} from './use-cases';
import {
  ApiSwaggerCreateReportUser,
  ApiSwaggerGetReportsUser,
  ApiSwaggerGetReportUserDetails,
  ApiSwaggerAcceptReportUser,
  ApiSwaggerRejectReportUser,
  ApiSwaggerReturnReportUserToPending,
} from './swagger';
import { REPORT_USER_MESSAGES } from './constants';

/**
 * Gerencia as requisições HTTP para operações relacionadas a denúncias de utilizadores.
 */
@ApiTags('Report User')
@Controller('report-user')
export class ReportUserController {
  constructor(
    private readonly createUseCase: CreateReportUserUseCase,
    private readonly getReportsUseCase: GetReportsUserUseCase,
    private readonly getDetailsUseCase: GetReportUserDetailsUseCase,
    private readonly acceptUseCase: AcceptReportUserUseCase,
    private readonly rejectUseCase: RejectReportUserUseCase,
    private readonly returnToPendingUseCase: ReturnReportUserToPendingUseCase,
  ) {}

  /**
   * Cria uma denúncia de utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateReportUserRequestDto} dto Os dados da denúncia.
   * @returns {Promise<ApiResponseDto<ReportUserResponseDto>>} A denúncia criada.
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REPORT_USERS)
  @ApiSwaggerCreateReportUser()
  async createReportUser(
    @User() user: jwtTypes.RequestUser,
    @Body() dto: CreateReportUserRequestDto,
  ): Promise<ApiResponseDto<ReportUserResponseDto>> {
    const result = await this.createUseCase.execute(
      user.publicId,
      dto.userReportedPublicId,
      dto.type,
    );
    return new ApiResponseDto(REPORT_USER_MESSAGES.CREATED, result);
  }

  /**
   * Lista utilizadores denunciados com agregações.
   *
   * @param {GetReportsUserRequestDto} dto Os filtros de busca.
   * @returns {Promise<ApiResponseDto<ReportUserListResponseDto[]>>} Lista de utilizadores denunciados.
   */
  @Get('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_USERS)
  @ApiSwaggerGetReportsUser()
  async getReportsUser(
    @Query() dto: GetReportsUserRequestDto,
  ): Promise<ApiResponseDto<ReportUserListResponseDto[]>> {
    const result = await this.getReportsUseCase.execute(
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.status,
    );
    return new ApiResponseDto(
      'Utilizadores denunciados obtidos com sucesso.',
      result,
    );
  }

  /**
   * Obtém detalhes de denúncias de um utilizador específico.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @returns {Promise<ApiResponseDto<ReportUserDetailResponseDto>>} Detalhes das denúncias.
   */
  @Get('manage/:userPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_USERS)
  @ApiSwaggerGetReportUserDetails()
  async getReportUserDetails(
    @Param('userPublicId') userPublicId: string,
  ): Promise<ApiResponseDto<ReportUserDetailResponseDto>> {
    const result = await this.getDetailsUseCase.execute(userPublicId);
    return new ApiResponseDto(
      'Detalhes das denúncias obtidos com sucesso.',
      result,
    );
  }

  /**
   * Aceita uma denúncia de utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportUserResponseDto>>} A denúncia aceite.
   */
  @Patch('manage/:publicId/accept')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_USERS)
  @ApiSwaggerAcceptReportUser()
  async acceptReportUser(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportUserResponseDto>> {
    const result = await this.acceptUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPORT_USER_MESSAGES.ACCEPTED, result);
  }

  /**
   * Rejeita uma denúncia de utilizador.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportUserResponseDto>>} A denúncia rejeitada.
   */
  @Patch('manage/:publicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_USERS)
  @ApiSwaggerRejectReportUser()
  async rejectReportUser(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportUserResponseDto>> {
    const result = await this.rejectUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPORT_USER_MESSAGES.REJECTED, result);
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportUserResponseDto>>} A denúncia atualizada.
   */
  @Patch('manage/:publicId/pending')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_USERS)
  @ApiSwaggerReturnReportUserToPending()
  async returnReportUserToPending(
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportUserResponseDto>> {
    const result = await this.returnToPendingUseCase.execute(publicId);
    return new ApiResponseDto(REPORT_USER_MESSAGES.RETURNED_TO_PENDING, result);
  }
}
