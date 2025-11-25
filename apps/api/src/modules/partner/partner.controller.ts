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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { PARTNER_MESSAGES } from '@modules/partner/constants';
import {
  ApplyPartnerRequestDto,
  PartnerApplicationResponseDto,
  PartnerSelfResponseDto,
  PartnerAdminResponseDto,
  UpdatePartnerRequestDto,
  GetPartnersManageRequestDto,
} from '@modules/partner/dto';
import {
  ApplyPartnerUseCase,
  GetPartnerSelfUseCase,
  UpdatePartnerSelfUseCase,
  GetPartnersManageUseCase,
  GetPartnerManageUseCase,
  ApprovePartnerManageUseCase,
  RejectPartnerManageUseCase,
  ActivatePartnerManageUseCase,
  DeactivatePartnerManageUseCase,
  DeletePartnerManageUseCase,
} from '@modules/partner/use-cases';
import {
  ApiSwaggerApplyPartner,
  ApiSwaggerGetPartnerSelf,
  ApiSwaggerUpdatePartnerSelf,
  ApiSwaggerGetPartnersManage,
  ApiSwaggerGetPartnerManage,
  ApiSwaggerApprovePartnerManage,
  ApiSwaggerRejectPartnerManage,
  ApiSwaggerActivatePartnerManage,
  ApiSwaggerDeactivatePartnerManage,
  ApiSwaggerDeletePartnerManage,
} from '@modules/partner/swagger';

/**
 * Gerencia as requisições HTTP para operações relacionadas a parcerias.
 */
@ApiTags('Partner')
@Controller('partner')
export class PartnerController {
  constructor(
    private readonly applyPartnerUseCase: ApplyPartnerUseCase,
    private readonly getPartnerSelfUseCase: GetPartnerSelfUseCase,
    private readonly updatePartnerSelfUseCase: UpdatePartnerSelfUseCase,
    private readonly getPartnersManageUseCase: GetPartnersManageUseCase,
    private readonly getPartnerManageUseCase: GetPartnerManageUseCase,
    private readonly approvePartnerManageUseCase: ApprovePartnerManageUseCase,
    private readonly rejectPartnerManageUseCase: RejectPartnerManageUseCase,
    private readonly activatePartnerManageUseCase: ActivatePartnerManageUseCase,
    private readonly deactivatePartnerManageUseCase: DeactivatePartnerManageUseCase,
    private readonly deletePartnerManageUseCase: DeletePartnerManageUseCase,
  ) {}

  /**
   * Submete uma candidatura de parceria para uma casa de banho.
   *
   * @param {ApplyPartnerRequestDto} applyPartnerDto Os dados da candidatura.
   * @param {Express.Multer.File} file O certificado de parceria.
   * @returns {Promise<ApiResponseDto<PartnerApplicationResponseDto>>} A candidatura criada.
   * @throws {NotFoundException} Se a casa de banho não for encontrada.
   * @throws {ConflictException} Se a casa de banho já tiver parceiro ou candidatura pendente.
   * @throws {BadRequestException} Se o arquivo for inválido ou exceder 10MB.
   */
  @ApiSwaggerApplyPartner()
  @Post('apply')
  @UseInterceptors(FileInterceptor('certificate'))
  async applyPartner(
    @Body() applyPartnerDto: ApplyPartnerRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^(application\/pdf|image\/(jpeg|jpg|png|webp))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiResponseDto<PartnerApplicationResponseDto>> {
    const result = await this.applyPartnerUseCase.execute(
      applyPartnerDto.toiletPublicId,
      applyPartnerDto.contactEmail,
      file,
    );

    return new ApiResponseDto(PARTNER_MESSAGES.APPLICATION_SUBMITTED, result);
  }

  /**
   * Obtém as informações da própria parceria.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<PartnerSelfResponseDto>>} As informações da parceria.
   * @throws {NotFoundException} Se o utilizador não tiver parceria.
   */
  @ApiSwaggerGetPartnerSelf()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  async getPartnerSelf(
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<PartnerSelfResponseDto>> {
    const result = await this.getPartnerSelfUseCase.execute(user.publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_RETRIEVED, result);
  }

  /**
   * Atualiza as informações de contacto da própria parceria.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {UpdatePartnerRequestDto} updatePartnerDto Os dados a atualizar.
   * @returns {Promise<ApiResponseDto<PartnerSelfResponseDto>>} As informações atualizadas.
   * @throws {NotFoundException} Se o utilizador não tiver parceria.
   */
  @ApiSwaggerUpdatePartnerSelf()
  @UseGuards(JwtAuthGuard)
  @Patch('self')
  async updatePartnerSelf(
    @User() user: jwtTypes.RequestUser,
    @Body() updatePartnerDto: UpdatePartnerRequestDto,
  ): Promise<ApiResponseDto<PartnerSelfResponseDto>> {
    const result = await this.updatePartnerSelfUseCase.execute(
      user.publicId,
      updatePartnerDto.contactEmail,
    );
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_UPDATED, result);
  }

  /**
   * Lista candidaturas de parceria com filtros e paginação.
   *
   * @param {GetPartnersManageRequestDto} getPartnersDto Os parâmetros de pesquisa e paginação.
   * @returns {Promise<ApiResponseDto<PartnerAdminResponseDto[]>>} A lista de candidaturas.
   */
  @ApiSwaggerGetPartnersManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_PARTNERS)
  @Get('manage')
  async getPartnersManage(
    @Query() getPartnersDto: GetPartnersManageRequestDto,
  ): Promise<ApiResponseDto<PartnerAdminResponseDto[]>> {
    const result = await this.getPartnersManageUseCase.execute(
      getPartnersDto.status,
      getPartnersDto.search,
      getPartnersDto.timestamp,
      getPartnersDto.pageable,
      getPartnersDto.page,
      getPartnersDto.size,
    );
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNERS_LISTED, result);
  }

  /**
   * Obtém os detalhes completos de uma candidatura de parceria.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<ApiResponseDto<PartnerAdminResponseDto>>} Os detalhes da candidatura.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   */
  @ApiSwaggerGetPartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_PARTNERS)
  @Get(':publicId/manage')
  async getPartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<PartnerAdminResponseDto>> {
    const result = await this.getPartnerManageUseCase.execute(publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_RETRIEVED, result);
  }

  /**
   * Aprova uma candidatura de parceria e cria a conta do utilizador.
   *
   * @param {string} publicId O ID público da parceria.
   * @param {jwtTypes.RequestUser} admin O administrador que está aprovando.
   * @returns {Promise<ApiResponseDto<void>>} Confirmação da aprovação.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a candidatura não estiver pendente.
   */
  @ApiSwaggerApprovePartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_PARTNERS)
  @Put(':publicId/manage/approve')
  async approvePartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() admin: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<void>> {
    await this.approvePartnerManageUseCase.execute(publicId, admin.publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.APPLICATION_APPROVED);
  }

  /**
   * Rejeita uma candidatura de parceria.
   *
   * @param {string} publicId O ID público da parceria.
   * @param {jwtTypes.RequestUser} admin O administrador que está rejeitando.
   * @returns {Promise<ApiResponseDto<void>>} Confirmação da rejeição.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a candidatura não estiver pendente.
   */
  @ApiSwaggerRejectPartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REVIEW_PARTNERS)
  @Put(':publicId/manage/reject')
  async rejectPartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() admin: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<void>> {
    await this.rejectPartnerManageUseCase.execute(publicId, admin.publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.APPLICATION_REJECTED);
  }

  /**
   * Reativa uma parceria que estava inativa.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<ApiResponseDto<PartnerAdminResponseDto>>} Os dados da parceria reativada.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a parceria não estiver inativa.
   */
  @ApiSwaggerActivatePartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.MANAGE_PARTNERS)
  @Put(':publicId/manage/activate')
  async activatePartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<PartnerAdminResponseDto>> {
    const result = await this.activatePartnerManageUseCase.execute(publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_ACTIVATED, result);
  }

  /**
   * Desativa uma parceria ativa.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<ApiResponseDto<PartnerAdminResponseDto>>} Os dados da parceria desativada.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   * @throws {ConflictException} Se a parceria não estiver ativa.
   */
  @ApiSwaggerDeactivatePartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.MANAGE_PARTNERS)
  @Put(':publicId/manage/deactivate')
  async deactivatePartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<PartnerAdminResponseDto>> {
    const result = await this.deactivatePartnerManageUseCase.execute(publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_DEACTIVATED, result);
  }

  /**
   * Remove permanentemente uma parceria.
   *
   * @param {string} publicId O ID público da parceria.
   * @returns {Promise<ApiResponseDto<void>>} Confirmação da deleção.
   * @throws {NotFoundException} Se a parceria não for encontrada.
   */
  @ApiSwaggerDeletePartnerManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_PARTNERS)
  @Delete(':publicId/manage')
  async deletePartnerManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<void>> {
    await this.deletePartnerManageUseCase.execute(publicId);
    return new ApiResponseDto(PARTNER_MESSAGES.PARTNER_DELETED);
  }
}
