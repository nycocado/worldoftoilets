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
import { GetRepliesRequestDto } from '@modules/reply/dto/get-replies-request.dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { ReplyResponseDto } from '@modules/reply/dto/reply-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName, ReplyState } from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { CreateReplyRequestDto } from '@modules/reply/dto/create-reply-request.dto';
import { REPLY_MESSAGES } from '@modules/reply/constants/messages.constant';
import { UpdateReplyRequestDto } from '@modules/reply/dto/update-reply-request.dto';
import {
  CreateReplyUseCase,
  DeleteReplyUseCase,
  DeleteReplyManageUseCase,
  GetRepliesByCommentUseCase,
  GetRepliesByUserUseCase,
  HideReplyUseCase,
  ShowReplyUseCase,
  UpdateReplyManageUseCase,
  UpdateReplyUseCase,
  UndeleteReplyUseCase,
} from '@modules/reply/use-cases';
import { GetRepliesManageRequestDto } from '@modules/reply/dto/get-replies-manage-request.dto';
import {
  ApiSwaggerGetRepliesByComment,
  ApiSwaggerGetRepliesByCommentManage,
  ApiSwaggerGetRepliesByUserSelf,
  ApiSwaggerGetRepliesByUserManage,
  ApiSwaggerCreateReply,
  ApiSwaggerUpdateReply,
  ApiSwaggerUpdateReplyManage,
  ApiSwaggerDeleteReply,
  ApiSwaggerDeleteReplyManage,
  ApiSwaggerShowReply,
  ApiSwaggerHideReply,
  ApiSwaggerUndeleteReply,
} from '@modules/reply/swagger';

/**
 * Gerencia as requisições HTTP para operações relacionadas a respostas de comentários.
 */
@Controller('reply')
export class ReplyController {
  constructor(
    private readonly createReplyUseCase: CreateReplyUseCase,
    private readonly deleteReplyUseCase: DeleteReplyUseCase,
    private readonly deleteReplyManageUseCase: DeleteReplyManageUseCase,
    private readonly getRepliesByCommentUseCase: GetRepliesByCommentUseCase,
    private readonly getRepliesByUserUseCase: GetRepliesByUserUseCase,
    private readonly updateReplyUseCase: UpdateReplyUseCase,
    private readonly updateReplyManageUseCase: UpdateReplyManageUseCase,
    private readonly showReplyUseCase: ShowReplyUseCase,
    private readonly hideReplyUseCase: HideReplyUseCase,
    private readonly undeleteReplyUseCase: UndeleteReplyUseCase,
  ) {}

  /**
   * Lista as respostas visíveis de um comentário específico.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {GetRepliesRequestDto} getRepliesRequestDto DTO com parâmetros de paginação e filtros.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} A lista de respostas.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @ApiSwaggerGetRepliesByComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPLIES)
  @Get('comment/:publicId')
  async getRepliesByComment(
    @Param('publicId') publicId: string,
    @Query() getRepliesRequestDto: GetRepliesRequestDto,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<ReplyResponseDto[]>> {
    const { pageable, page, size, timestamp } = getRepliesRequestDto || {};

    const result = await this.getRepliesByCommentUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      ReplyState.VISIBLE,
      timestamp,
      user.publicId,
    );

    return new ApiResponseDto<ReplyResponseDto[]>(
      REPLY_MESSAGES.GET_BY_COMMENT_SUCCESS,
      result,
    );
  }

  /**
   * Lista todas as respostas de um comentário para fins de moderação.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {GetRepliesManageRequestDto} getRepliesRequestDto DTO com parâmetros de paginação e filtros de estado.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} A lista de respostas.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @ApiSwaggerGetRepliesByCommentManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_REPLIES)
  @Get('comment/:publicId/manage')
  async getRepliesByCommentManage(
    @Param('publicId') publicId: string,
    @Query() getRepliesRequestDto: GetRepliesManageRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto[]>> {
    const { pageable, page, size, replyState, timestamp } =
      getRepliesRequestDto || {};
    const result = await this.getRepliesByCommentUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      replyState,
      timestamp,
    );

    return new ApiResponseDto<ReplyResponseDto[]>(
      REPLY_MESSAGES.GET_BY_COMMENT_MANAGE_SUCCESS,
      result,
    );
  }

  /**
   * Lista as respostas visíveis do próprio utilizador autenticado.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {GetRepliesRequestDto} getRepliesRequestDto DTO com parâmetros de paginação e filtros.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} A lista de respostas do utilizador.
   */
  @ApiSwaggerGetRepliesByUserSelf()
  @UseGuards(JwtAuthGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPLIES)
  @Get('user/self')
  async getRepliesByMyUser(
    @User() user: jwtTypes.RequestUser,
    @Query() getRepliesRequestDto: GetRepliesRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto[]>> {
    const { pageable, page, size, timestamp } = getRepliesRequestDto || {};

    const result = await this.getRepliesByUserUseCase.execute(
      user.publicId,
      pageable,
      page,
      size,
      ReplyState.VISIBLE,
      timestamp,
    );

    return new ApiResponseDto<ReplyResponseDto[]>(
      REPLY_MESSAGES.GET_BY_SELF_USER_SUCCESS,
      result,
    );
  }

  /**
   * Lista todas as respostas de um utilizador específico para fins de moderação.
   *
   * @param {string} publicId O identificador público do utilizador.
   * @param {GetRepliesManageRequestDto} getRepliesRequestDto DTO com parâmetros de paginação e filtros de estado.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} A lista de respostas do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  @ApiSwaggerGetRepliesByUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_REPLIES)
  @Get('user/:publicId/manage')
  async getRepliesByUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Query() getRepliesRequestDto: GetRepliesManageRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto[]>> {
    const { pageable, page, size, replyState, timestamp } =
      getRepliesRequestDto || {};
    const result = await this.getRepliesByUserUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      replyState,
      timestamp,
    );

    return new ApiResponseDto<ReplyResponseDto[]>(
      REPLY_MESSAGES.GET_BY_USER_SUCCESS,
      result,
    );
  }

  /**
   * Cria uma nova resposta para um comentário.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateReplyRequestDto} createReplyDto DTO com os dados da nova resposta.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta criada.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @ApiSwaggerCreateReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.CREATE_REPLIES)
  @Post('')
  async postReply(
    @User() user: jwtTypes.RequestUser,
    @Body() createReplyDto: CreateReplyRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const { commentPublicId, text } = createReplyDto;

    const reply = await this.createReplyUseCase.execute(
      user.publicId,
      commentPublicId,
      text,
    );

    return new ApiResponseDto(REPLY_MESSAGES.CREATE_REPLY_SUCCESS, reply);
  }

  /**
   * Atualiza a própria resposta.
   *
   * @param {string} publicId O identificador público da resposta.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {UpdateReplyRequestDto} updateReplyDto DTO com os dados a serem atualizados.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {UnauthorizedException} Se o utilizador não for o autor da resposta.
   */
  @ApiSwaggerUpdateReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_SELF_REPLIES)
  @Patch(':publicId')
  async patchReply(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
    @Body() updateReplyDto: UpdateReplyRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const { text } = updateReplyDto;

    const reply = await this.updateReplyUseCase.execute(
      publicId,
      user.publicId,
      text,
    );

    return new ApiResponseDto(REPLY_MESSAGES.UPDATE_REPLY_SUCCESS, reply);
  }

  /**
   * Atualiza uma resposta para fins de moderação.
   *
   * @param {string} publicId O identificador público da resposta.
   * @param {UpdateReplyRequestDto} updateReplyDto DTO com os dados a serem atualizados.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  @ApiSwaggerUpdateReplyManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_REPLIES)
  @Patch(':publicId/manage')
  async patchReplyManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() updateReplyDto: UpdateReplyRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const { text } = updateReplyDto;

    const reply = await this.updateReplyManageUseCase.execute(publicId, text);

    return new ApiResponseDto(
      REPLY_MESSAGES.UPDATE_REPLY_MANAGE_SUCCESS,
      reply,
    );
  }

  /**
   * Realiza o soft delete da própria resposta.
   *
   * @param {string} publicId O identificador público da resposta.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {UnauthorizedException} Se o utilizador não for o autor da resposta.
   */
  @ApiSwaggerDeleteReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_SELF_REPLIES)
  @Delete(':publicId')
  async deleteReply(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteReplyUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPLY_MESSAGES.DELETE_REPLY_SUCCESS);
  }

  /**
   * Realiza o soft delete de uma resposta para fins de moderação.
   *
   * @param {string} publicId O identificador público da resposta.
   * @param {jwtTypes.RequestUser} user O moderador autenticado.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  @ApiSwaggerDeleteReplyManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_REPLIES)
  @Delete(':publicId/manage')
  async deleteReplyManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteReplyManageUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(REPLY_MESSAGES.DELETE_REPLY_MANAGE_SUCCESS);
  }

  /**
   * Torna uma resposta visível (moderação).
   *
   * @param {string} publicId O identificador público da resposta.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {ConflictException} Se a resposta já foi deletada.
   */
  @ApiSwaggerShowReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SHOW_REPLIES)
  @Put(':publicId/manage/show')
  async showReply(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const reply = await this.showReplyUseCase.execute(publicId);
    return new ApiResponseDto<ReplyResponseDto>(
      REPLY_MESSAGES.SHOW_REPLY_SUCCESS,
      reply,
    );
  }

  /**
   * Oculta uma resposta (moderação).
   *
   * @param {string} publicId O identificador público da resposta.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta atualizada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   * @throws {ConflictException} Se a resposta já foi deletada.
   */
  @ApiSwaggerHideReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.HIDE_REPLIES)
  @Put(':publicId/manage/hide')
  async hideReply(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const reply = await this.hideReplyUseCase.execute(publicId);
    return new ApiResponseDto<ReplyResponseDto>(
      REPLY_MESSAGES.HIDE_REPLY_SUCCESS,
      reply,
    );
  }

  /**
   * Recupera uma resposta que sofreu soft delete (moderação).
   *
   * @param {string} publicId O identificador público da resposta.
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} A resposta recuperada.
   * @throws {NotFoundException} Se a resposta não for encontrada.
   */
  @ApiSwaggerUndeleteReply()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.UNDELETE_REPLIES)
  @Put(':publicId/manage/undelete')
  async undeleteReply(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<ReplyResponseDto>> {
    const reply = await this.undeleteReplyUseCase.execute(publicId);
    return new ApiResponseDto<ReplyResponseDto>(
      REPLY_MESSAGES.UNDELETE_REPLY_SUCCESS,
      reply,
    );
  }
}
