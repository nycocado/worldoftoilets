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
  CreateReportReplyRequestDto,
  GetReportsReplyRequestDto,
  ReportReplyDetailResponseDto,
  ReportReplyListResponseDto,
  ReportReplyResponseDto,
} from './dto';
import {
  CreateReportReplyUseCase,
  GetReportsReplyUseCase,
  GetReportReplyDetailsUseCase,
  AcceptReportReplyUseCase,
  RejectReportReplyUseCase,
  ReturnReportReplyToPendingUseCase,
} from './use-cases';
import {
  ApiSwaggerCreateReportReply,
  ApiSwaggerGetReportsReply,
  ApiSwaggerGetReportReplyDetails,
  ApiSwaggerAcceptReportReply,
  ApiSwaggerRejectReportReply,
  ApiSwaggerReturnReportReplyToPending,
} from './swagger';
import { REPORT_REPLY_MESSAGES } from './constants';

/**
 * Gerencia as requisições HTTP para operações relacionadas a denúncias de respostas.
 */
@ApiTags('Report Reply')
@Controller('report-reply')
export class ReportReplyController {
  constructor(
    private readonly createUseCase: CreateReportReplyUseCase,
    private readonly getReportsUseCase: GetReportsReplyUseCase,
    private readonly getDetailsUseCase: GetReportReplyDetailsUseCase,
    private readonly acceptUseCase: AcceptReportReplyUseCase,
    private readonly rejectUseCase: RejectReportReplyUseCase,
    private readonly returnToPendingUseCase: ReturnReportReplyToPendingUseCase,
  ) {}

  /**
   * Cria uma denúncia de resposta.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateReportReplyRequestDto} dto Os dados da denúncia.
   * @returns {Promise<ApiResponseDto<ReportReplyResponseDto>>} A denúncia criada.
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REPORT_REPLIES)
  @ApiSwaggerCreateReportReply()
  async createReportReply(
    @User() user: jwtTypes.RequestUser,
    @Body() dto: CreateReportReplyRequestDto,
  ): Promise<ApiResponseDto<ReportReplyResponseDto>> {
    const result = await this.createUseCase.execute(
      user.publicId,
      dto.replyPublicId,
      dto.type,
    );
    return new ApiResponseDto(REPORT_REPLY_MESSAGES.CREATED, result);
  }

  /**
   * Lista respostas denunciadas com agregações.
   *
   * @param {GetReportsReplyRequestDto} dto Os filtros de busca.
   * @returns {Promise<ApiResponseDto<ReportReplyListResponseDto[]>>} Lista de respostas denunciadas.
   */
  @Get('manage')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_REPLIES)
  @ApiSwaggerGetReportsReply()
  async getReportsReply(
    @Query() dto: GetReportsReplyRequestDto,
  ): Promise<ApiResponseDto<ReportReplyListResponseDto[]>> {
    const result = await this.getReportsUseCase.execute(
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.status,
    );
    return new ApiResponseDto(
      'Respostas denunciadas obtidas com sucesso.',
      result,
    );
  }

  /**
   * Obtém detalhes de denúncias de uma resposta específica.
   *
   * @param {string} replyPublicId O ID público da resposta.
   * @returns {Promise<ApiResponseDto<ReportReplyDetailResponseDto>>} Detalhes das denúncias.
   */
  @Get('manage/:replyPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPORT_REPLIES)
  @ApiSwaggerGetReportReplyDetails()
  async getReportReplyDetails(
    @Param('replyPublicId') replyPublicId: string,
  ): Promise<ApiResponseDto<ReportReplyDetailResponseDto>> {
    const result = await this.getDetailsUseCase.execute(replyPublicId);
    return new ApiResponseDto(
      'Detalhes das denúncias obtidos com sucesso.',
      result,
    );
  }

  /**
   * Aceita uma denúncia de resposta.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportReplyResponseDto>>} A denúncia aceite.
   */
  @Patch('manage/:publicId/accept')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_REPLIES)
  @ApiSwaggerAcceptReportReply()
  async acceptReportReply(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportReplyResponseDto>> {
    const result = await this.acceptUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPORT_REPLY_MESSAGES.ACCEPTED, result);
  }

  /**
   * Rejeita uma denúncia de resposta.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado (revisor).
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportReplyResponseDto>>} A denúncia rejeitada.
   */
  @Patch('manage/:publicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_REPLIES)
  @ApiSwaggerRejectReportReply()
  async rejectReportReply(
    @User() user: jwtTypes.RequestUser,
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportReplyResponseDto>> {
    const result = await this.rejectUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPORT_REPLY_MESSAGES.REJECTED, result);
  }

  /**
   * Retorna uma denúncia ao status pendente.
   *
   * @param {string} publicId O ID público da denúncia.
   * @returns {Promise<ApiResponseDto<ReportReplyResponseDto>>} A denúncia atualizada.
   */
  @Patch('manage/:publicId/pending')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_REPORT_REPLIES)
  @ApiSwaggerReturnReportReplyToPending()
  async returnReportReplyToPending(
    @Param('publicId') publicId: string,
  ): Promise<ApiResponseDto<ReportReplyResponseDto>> {
    const result = await this.returnToPendingUseCase.execute(publicId);
    return new ApiResponseDto(
      REPORT_REPLY_MESSAGES.RETURNED_TO_PENDING,
      result,
    );
  }
}
