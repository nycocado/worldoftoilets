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
  CreateReportCommentRequestDto,
  GetReportsCommentRequestDto,
  ReportCommentDetailResponseDto,
  ReportCommentListResponseDto,
  ReportCommentResponseDto,
} from './dto';
import {
  CreateReportCommentUseCase,
  GetReportsCommentUseCase,
  GetReportCommentDetailsUseCase,
  AcceptReportCommentUseCase,
  RejectReportCommentUseCase,
  ReturnReportCommentToPendingUseCase,
} from './use-cases';
import {
  ApiSwaggerCreateReportComment,
  ApiSwaggerGetReportsComment,
  ApiSwaggerGetReportCommentDetails,
  ApiSwaggerAcceptReportComment,
  ApiSwaggerRejectReportComment,
  ApiSwaggerReturnReportCommentToPending,
} from './swagger';
import { REPORT_COMMENT_MESSAGES } from './constants';

/**
 * Gerencia as requisições HTTP para operações relacionadas a denúncias de comentários.
 */
@ApiTags('Report Comment')
@Controller('report-comment')
export class ReportCommentController {
  constructor(
    private readonly createUseCase: CreateReportCommentUseCase,
    private readonly getReportsUseCase: GetReportsCommentUseCase,
    private readonly getDetailsUseCase: GetReportCommentDetailsUseCase,
    private readonly acceptUseCase: AcceptReportCommentUseCase,
    private readonly rejectUseCase: RejectReportCommentUseCase,
    private readonly returnToPendingUseCase: ReturnReportCommentToPendingUseCase,
  ) {}

  /**
   * Cria uma denúncia de comentário.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateReportCommentRequestDto} dto Os dados da denúncia.
   * @returns {Promise<ApiResponseDto<ReportCommentResponseDto>>} A denúncia criada.
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REPORT_COMMENTS)
  @ApiSwaggerCreateReportComment()
  async createReportComment(
    @User() user: jwtTypes.RequestUser,
    @Body() dto: CreateReportCommentRequestDto,
  ): Promise<ApiResponseDto<ReportCommentResponseDto>> {
    const result = await this.createUseCase.execute(
      user.publicId,
      dto.commentPublicId,
      dto.typeReportComment,
    );
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.CREATE_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Lista comentários denunciados com agregações.
   *
   * @param {GetReportsCommentRequestDto} dto Os filtros de busca.
   * @returns {Promise<ApiResponseDto<ReportCommentListResponseDto[]>>} Lista de comentários denunciados.
   */
  @Get('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_COMMENTS)
  @ApiSwaggerGetReportsComment()
  async getReportsComment(
    @Query() dto: GetReportsCommentRequestDto,
  ): Promise<ApiResponseDto<ReportCommentListResponseDto[]>> {
    const result = await this.getReportsUseCase.execute(
      dto.status,
      dto.pageable,
      dto.page,
      dto.size,
    );
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.GET_REPORTS_SUCCESS,
      result,
    );
  }

  /**
   * Obtém detalhes de denúncias de um comentário específico.
   *
   * @param {string} commentPublicId O ID público do comentário.
   * @returns {Promise<ApiResponseDto<ReportCommentDetailResponseDto>>} Detalhes das denúncias.
   */
  @Get('manage/:commentPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_COMMENTS)
  @ApiSwaggerGetReportCommentDetails()
  async getReportCommentDetails(
    @Param('commentPublicId') commentPublicId: string,
  ): Promise<ApiResponseDto<ReportCommentDetailResponseDto>> {
    const result = await this.getDetailsUseCase.execute(commentPublicId);
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.GET_REPORT_DETAILS_SUCCESS,
      result,
    );
  }

  /**
   * Aceita uma denúncia de comentário.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportCommentResponseDto>>} A denúncia aceite.
   */
  @Patch('manage/:publicId/accept')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_COMMENTS)
  @ApiSwaggerAcceptReportComment()
  async acceptReportComment(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportCommentResponseDto>> {
    const result = await this.acceptUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.ACCEPT_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Rejeita uma denúncia de comentário.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportCommentResponseDto>>} A denúncia rejeitada.
   */
  @Patch('manage/:publicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_COMMENTS)
  @ApiSwaggerRejectReportComment()
  async rejectReportComment(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportCommentResponseDto>> {
    const result = await this.rejectUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.REJECT_REPORT_SUCCESS,
      result,
    );
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportCommentResponseDto>>} A denúncia atualizada.
   */
  @Patch('manage/:publicId/pending')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_COMMENTS)
  @ApiSwaggerReturnReportCommentToPending()
  async returnReportCommentToPending(
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportCommentResponseDto>> {
    const result = await this.returnToPendingUseCase.execute(publicId);
    return new ApiResponseDto(
      REPORT_COMMENT_MESSAGES.RETURN_TO_PENDING_SUCCESS,
      result,
    );
  }
}
