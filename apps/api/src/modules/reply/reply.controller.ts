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
 * Controlador de Respostas
 *
 * @class ReplyController
 * @description Controlador que expõe endpoints HTTP para operações de respostas a comentários.
 * Processa requests, valida DTOs, aplica guards de autenticação e permissões,
 * e delega lógica de negócio para os use cases apropriados.
 *
 * @route /reply - Rota base para todos os endpoints de respostas
 *
 * @endpoints
 * - GET /reply/comment/:publicId - Listar respostas de comentário (público)
 * - GET /reply/comment/:publicId/manage - Listar todas respostas de comentário (moderação)
 * - GET /reply/user/self - Listar respostas do próprio utilizador
 * - GET /reply/user/:publicId/manage - Listar respostas de utilizador (moderação)
 * - POST /reply - Criar nova resposta
 * - PATCH /reply/:publicId - Atualizar própria resposta
 * - PATCH /reply/:publicId/manage - Atualizar qualquer resposta (moderação)
 * - DELETE /reply/:publicId - Deletar própria resposta
 * - DELETE /reply/:publicId/manage - Deletar qualquer resposta (moderação)
 * - PUT /reply/:publicId/manage/show - Tornar resposta visível (moderação)
 * - PUT /reply/:publicId/manage/hide - Ocultar resposta (moderação)
 * - PUT /reply/:publicId/manage/undelete - Recuperar resposta deletada (moderação)
 *
 * @see CreateReplyUseCase, UpdateReplyUseCase, DeleteReplyUseCase - Use cases principais
 * @see GetRepliesByCommentUseCase, GetRepliesByUserUseCase - Use cases de listagem
 * @see ShowReplyUseCase, HideReplyUseCase, UndeleteReplyUseCase - Use cases de moderação
 */
@Controller('reply')
export class ReplyController {
  /**
   * Construtor do ReplyController
   *
   * @param {CreateReplyUseCase} createReplyUseCase - Use case para criar resposta
   * @param {DeleteReplyUseCase} deleteReplyUseCase - Use case para deletar própria resposta
   * @param {DeleteReplyManageUseCase} deleteReplyManageUseCase - Use case para deletar qualquer resposta
   * @param {GetRepliesByCommentUseCase} getRepliesByCommentUseCase - Use case para listar por comentário
   * @param {GetRepliesByUserUseCase} getRepliesByUserUseCase - Use case para listar por utilizador
   * @param {UpdateReplyUseCase} updateReplyUseCase - Use case para atualizar própria resposta
   * @param {UpdateReplyManageUseCase} updateReplyManageUseCase - Use case para atualizar qualquer resposta
   * @param {ShowReplyUseCase} showReplyUseCase - Use case para tornar resposta visível
   * @param {HideReplyUseCase} hideReplyUseCase - Use case para ocultar resposta
   * @param {UndeleteReplyUseCase} undeleteReplyUseCase - Use case para recuperar resposta deletada
   */
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
   * Listar respostas de comentário (público)
   *
   * @async
   * @route GET /reply/comment/:publicId
   * @protected Requer autenticação JWT e permissão VIEW_REPLIES
   * @param {string} publicId - Identificador público do comentário
   * @param {GetRepliesRequestDto} getRepliesRequestDto - Parâmetros de paginação e filtros
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} Lista de respostas visíveis
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_REPLIES
   *
   * @description
   * Lista respostas VISÍVEIS de um comentário específico.
   * Suporta paginação e filtragem por timestamp.
   * Respostas ocultas ou deletadas não são retornadas.
   */
  @ApiSwaggerGetRepliesByComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_REPLIES)
  @Get('comment/:publicId')
  async getRepliesByComment(
    @Param('publicId') publicId: string,
    @Query() getRepliesRequestDto: GetRepliesRequestDto,
  ): Promise<ApiResponseDto<ReplyResponseDto[]>> {
    const { pageable, page, size, timestamp } = getRepliesRequestDto || {};

    const result = await this.getRepliesByCommentUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      ReplyState.VISIBLE,
      timestamp,
    );

    return new ApiResponseDto<ReplyResponseDto[]>(
      REPLY_MESSAGES.GET_BY_COMMENT_SUCCESS,
      result,
    );
  }

  /**
   * Listar todas respostas de comentário (moderação)
   *
   * @async
   * @route GET /reply/comment/:publicId/manage
   * @protected Requer autenticação JWT e permissão VIEW_REPLIES
   * @param {string} publicId - Identificador público do comentário
   * @param {GetRepliesManageRequestDto} getRepliesRequestDto - Parâmetros de paginação, filtros e estado
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} Lista de todas as respostas
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_REPLIES
   *
   * @description
   * Lista TODAS as respostas de um comentário (visíveis, ocultas, deletadas).
   * Suporta filtro por estado de resposta. Usado por moderadores.
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
   * Listar próprias respostas
   *
   * @async
   * @route GET /reply/user/self
   * @protected Requer autenticação JWT
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {GetRepliesRequestDto} getRepliesRequestDto - Parâmetros de paginação e filtros
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} Lista de próprias respostas visíveis
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   *
   * @description
   * Lista respostas VISÍVEIS do próprio utilizador autenticado.
   * Suporta paginação e filtragem por timestamp.
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
   * Listar respostas de utilizador (moderação)
   *
   * @async
   * @route GET /reply/user/:publicId/manage
   * @protected Requer autenticação JWT e permissão VIEW_REPLIES
   * @param {string} publicId - Identificador público do utilizador
   * @param {GetRepliesManageRequestDto} getRepliesRequestDto - Parâmetros de paginação, filtros e estado
   * @returns {Promise<ApiResponseDto<ReplyResponseDto[]>>} Lista de respostas do utilizador
   * @throws {NotFoundException} Se utilizador não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_REPLIES
   *
   * @description
   * Lista TODAS as respostas de um utilizador específico.
   * Suporta filtro por estado de resposta. Usado por moderadores.
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
   * Criar resposta
   *
   * @async
   * @route POST /reply
   * @protected Requer autenticação JWT e permissão CREATE_REPLIES
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {CreateReplyRequestDto} createReplyDto - Dados da resposta (comentário, texto)
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta criada
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão CREATE_REPLIES
   *
   * @description
   * Cria nova resposta a um comentário com texto obrigatório.
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
   * Atualizar própria resposta
   *
   * @async
   * @route PATCH /reply/:publicId
   * @protected Requer autenticação JWT e permissão EDIT_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {UpdateReplyRequestDto} updateReplyDto - Novos dados da resposta
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta atualizada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token inválido, ausente ou utilizador não é o autor
   * @throws {ForbiddenException} Se utilizador não possuir permissão EDIT_REPLIES
   *
   * @description
   * Atualiza texto da própria resposta.
   * Apenas o autor pode editar sua resposta.
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
   * Atualizar qualquer resposta (moderação)
   *
   * @async
   * @route PATCH /reply/:publicId/manage
   * @protected Requer autenticação JWT e permissão EDIT_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @param {UpdateReplyRequestDto} updateReplyDto - Novos dados da resposta
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta atualizada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão EDIT_REPLIES
   *
   * @description
   * Atualiza texto de qualquer resposta.
   * Não verifica propriedade - usado por moderadores.
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
   * Deletar própria resposta
   *
   * @async
   * @route DELETE /reply/:publicId
   * @protected Requer autenticação JWT e permissão DELETE_SELF_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token inválido, ausente ou utilizador não é o autor
   * @throws {ForbiddenException} Se utilizador não possuir permissão DELETE_SELF_REPLIES
   *
   * @description
   * Soft delete da própria resposta. Apenas o autor pode deletar.
   * Pode ser recuperada antes do período de retenção expirar.
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
   * Deletar qualquer resposta (moderação)
   *
   * @async
   * @route DELETE /reply/:publicId/manage
   * @protected Requer autenticação JWT e permissão DELETE_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @param {jwtTypes.RequestUser} user - Moderador autenticado (extraído do JWT)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão DELETE_REPLIES
   *
   * @description
   * Soft delete de qualquer resposta. Não verifica propriedade.
   * Usado por moderadores. Pode ser recuperada antes de expirar.
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
   * Mostrar resposta (moderação)
   *
   * @async
   * @route PUT /reply/:publicId/manage/show
   * @protected Requer autenticação JWT e permissão SHOW_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta tornada visível
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão SHOW_REPLIES
   * @throws {ConflictException} Se resposta foi deletada
   *
   * @description
   * Torna resposta visível publicamente alterando estado de HIDDEN para VISIBLE.
   * Usado por moderadores.
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
   * Ocultar resposta (moderação)
   *
   * @async
   * @route PUT /reply/:publicId/manage/hide
   * @protected Requer autenticação JWT e permissão HIDE_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta ocultada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão HIDE_REPLIES
   * @throws {ConflictException} Se resposta foi deletada
   *
   * @description
   * Oculta resposta do público alterando estado de VISIBLE para HIDDEN sem deletar.
   * Usado por moderadores.
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
   * Recuperar resposta deletada (moderação)
   *
   * @async
   * @route PUT /reply/:publicId/manage/undelete
   * @protected Requer autenticação JWT e permissão UNDELETE_REPLIES
   * @param {string} publicId - Identificador público da resposta
   * @returns {Promise<ApiResponseDto<ReplyResponseDto>>} Resposta recuperada
   * @throws {NotFoundException} Se resposta não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão UNDELETE_REPLIES
   *
   * @description
   * Recupera resposta soft-deleted revertendo soft delete e restaurando estado VISIBLE.
   * Usado por moderadores. Apenas funciona para respostas que ainda não expiraram.
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
