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
import { GetCommentsRequestDto } from '@modules/comment/dto/get-comments-request.dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { CommentResponseDto } from '@modules/comment/dto/comment-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import {
  CommentState,
  PermissionApiName,
  ReactDiscriminator,
} from '@database/entities';
import * as jwtTypes from '@common/types/jwt.types';
import { CreateCommentRequestDto } from '@modules/comment/dto/create-comment-request.dto';
import { COMMENT_MESSAGES } from '@modules/comment/constants/messages.constant';
import { UpdateCommentRequestDto } from '@modules/comment/dto/update-comment-request.dto';
import { PutReactRequestDto } from '@modules/comment/dto/put-react-request.dto';
import {
  CreateCommentUseCase,
  DeleteCommentUseCase,
  GetCommentsByToiletPublicIdUseCase,
  GetCommentsByUserIdUseCase,
  GetCommentsByUserPublicIdUseCase,
  HideCommentUseCase,
  ShowCommentUseCase,
  UpdateCommentManageUseCase,
  UpdateCommentUseCase,
} from '@modules/comment/use-cases';
import { PutReactUseCase } from '@modules/comment/use-cases/put-react.use-case';
import { GetCommentsManageRequestDto } from '@modules/comment/dto/get-comments-manage-request.dto';
import { DeleteCommentManageUseCase } from '@modules/comment/use-cases/delete-comment-manage.use-case';
import { UndeleteCommentUseCase } from '@modules/comment/use-cases/undelete-comment.use-case';
import {
  ApiSwaggerGetCommentsByToilet,
  ApiSwaggerGetCommentsByToiletManage,
  ApiSwaggerGetCommentsByUserSelf,
  ApiSwaggerGetCommentsByUserManage,
  ApiSwaggerCreateComment,
  ApiSwaggerUpdateComment,
  ApiSwaggerUpdateCommentManage,
  ApiSwaggerDeleteComment,
  ApiSwaggerDeleteCommentManage,
  ApiSwaggerPutReact,
  ApiSwaggerShowComment,
  ApiSwaggerHideComment,
  ApiSwaggerUndeleteComment,
} from '@modules/comment/swagger';

/**
 * Controlador de Comentários
 *
 * @class CommentController
 * @description Controlador que expõe endpoints HTTP para operações de comentários em toilets.
 * Processa requests, valida DTOs, aplica guards de autenticação e permissões,
 * e delega lógica de negócio para os use cases apropriados.
 *
 * @route /comment - Rota base para todos os endpoints de comentários
 *
 * @endpoints
 * - GET /comment/toilet/:publicId - Listar comentários de toilet (público)
 * - GET /comment/toilet/:publicId/manage - Listar todos comentários de toilet (moderação)
 * - GET /comment/user/self - Listar comentários do próprio utilizador
 * - GET /comment/user/:publicId/manage - Listar comentários de utilizador (moderação)
 * - POST /comment - Criar novo comentário
 * - PATCH /comment/:publicId - Atualizar próprio comentário
 * - PATCH /comment/:publicId/manage - Atualizar qualquer comentário (moderação)
 * - DELETE /comment/:publicId - Deletar próprio comentário
 * - DELETE /comment/:publicId/manage - Deletar qualquer comentário (moderação)
 * - PUT /comment/:publicId/react - Adicionar/remover reação (like/dislike)
 * - PUT /comment/:publicId/show - Tornar comentário visível (moderação)
 * - PUT /comment/:publicId/hide - Ocultar comentário (moderação)
 * - PUT /comment/:publicId/undelete - Recuperar comentário deletado (moderação)
 *
 * @see CreateCommentUseCase, UpdateCommentUseCase, DeleteCommentUseCase - Use cases principais
 * @see GetCommentsByToiletPublicIdUseCase, GetCommentsByUserIdUseCase - Use cases de listagem
 * @see PutReactUseCase - Use case de reações
 * @see ShowCommentUseCase, HideCommentUseCase, UndeleteCommentUseCase - Use cases de moderação
 */
@Controller('comment')
export class CommentController {
  /**
   * Construtor do CommentController
   *
   * @param {CreateCommentUseCase} createCommentUseCase - Use case para criar comentário
   * @param {DeleteCommentUseCase} deleteCommentUseCase - Use case para deletar próprio comentário
   * @param {DeleteCommentManageUseCase} deleteCommentManageUseCase - Use case para deletar qualquer comentário
   * @param {GetCommentsByToiletPublicIdUseCase} getCommentsByToiletPublicIdUseCase - Use case para listar por toilet
   * @param {GetCommentsByUserIdUseCase} getCommentsByUserIdUseCase - Use case para listar por ID de utilizador
   * @param {GetCommentsByUserPublicIdUseCase} getCommentsByUserPublicIdUseCase - Use case para listar por publicId de utilizador
   * @param {PutReactUseCase} putReactUseCase - Use case para reagir a comentário
   * @param {UpdateCommentUseCase} updateCommentUseCase - Use case para atualizar próprio comentário
   * @param {UpdateCommentManageUseCase} updateCommentManageUseCase - Use case para atualizar qualquer comentário
   * @param {ShowCommentUseCase} showCommentUseCase - Use case para tornar comentário visível
   * @param {HideCommentUseCase} hideCommentUseCase - Use case para ocultar comentário
   * @param {UndeleteCommentUseCase} undeleteCommentUseCase - Use case para recuperar comentário deletado
   */
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly deleteCommentManageUseCase: DeleteCommentManageUseCase,
    private readonly getCommentsByToiletPublicIdUseCase: GetCommentsByToiletPublicIdUseCase,
    private readonly getCommentsByUserIdUseCase: GetCommentsByUserIdUseCase,
    private readonly getCommentsByUserPublicIdUseCase: GetCommentsByUserPublicIdUseCase,
    private readonly putReactUseCase: PutReactUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly updateCommentManageUseCase: UpdateCommentManageUseCase,
    private readonly showCommentUseCase: ShowCommentUseCase,
    private readonly hideCommentUseCase: HideCommentUseCase,
    private readonly undeleteCommentUseCase: UndeleteCommentUseCase,
  ) {}

  /**
   * Listar comentários de toilet (público)
   *
   * @async
   * @route GET /comment/toilet/:publicId
   * @protected Requer autenticação JWT e permissão VIEW_COMMENTS
   * @param {string} publicId - Identificador público do toilet
   * @param {GetCommentsRequestDto} getByToiletsRequestDto - Parâmetros de paginação e filtros
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} Lista de comentários visíveis
   * @throws {NotFoundException} Se toilet não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_COMMENTS
   *
   * @description
   * Lista comentários VISÍVEIS de um toilet específico.
   * Suporta paginação e filtragem por timestamp.
   * Comentários ocultos ou deletados não são retornados.
   */
  @ApiSwaggerGetCommentsByToilet()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_COMMENTS)
  @Get('toilet/:publicId')
  async getCommentsByToilet(
    @Param('publicId') publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, timestamp } = getByToiletsRequestDto || {};

    const result = await this.getCommentsByToiletPublicIdUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      CommentState.VISIBLE,
      timestamp,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_TOILET_SUCCESS,
      result,
    );
  }

  /**
   * Listar todos comentários de toilet (moderação)
   *
   * @async
   * @route GET /comment/toilet/:publicId/manage
   * @protected Requer autenticação JWT e permissão VIEW_ALL_COMMENTS
   * @param {string} publicId - Identificador público do toilet
   * @param {GetCommentsManageRequestDto} getByToiletsRequestDto - Parâmetros de paginação, filtros e estado
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} Lista de todos os comentários
   * @throws {NotFoundException} Se toilet não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_ALL_COMMENTS
   *
   * @description
   * Lista TODOS os comentários de um toilet (visíveis, ocultos, deletados).
   * Suporta filtro por estado de comentário. Usado por moderadores.
   */
  @ApiSwaggerGetCommentsByToiletManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_COMMENTS)
  @Get('toilet/:publicId/manage')
  async getCommentsByToiletManage(
    @Param('publicId') publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsManageRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, commentState, timestamp } =
      getByToiletsRequestDto || {};
    const result = await this.getCommentsByToiletPublicIdUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_TOILET_MANAGE_SUCCESS,
      result,
    );
  }

  /**
   * Listar próprios comentários
   *
   * @async
   * @route GET /comment/user/self
   * @protected Requer autenticação JWT
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {GetCommentsRequestDto} getByToiletsRequestDto - Parâmetros de paginação e filtros
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} Lista de próprios comentários visíveis
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   *
   * @description
   * Lista comentários VISÍVEIS do próprio utilizador autenticado.
   * Suporta paginação e filtragem por timestamp.
   */
  @ApiSwaggerGetCommentsByUserSelf()
  @UseGuards(JwtAuthGuard)
  @Get('user/self')
  async getCommentsByMyUser(
    @User() user: jwtTypes.RequestUser,
    @Query() getByToiletsRequestDto: GetCommentsRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, timestamp } = getByToiletsRequestDto || {};

    const result = await this.getCommentsByUserIdUseCase.execute(
      user.id,
      pageable,
      page,
      size,
      CommentState.VISIBLE,
      timestamp,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_SELF_USER_SUCCESS,
      result,
    );
  }

  /**
   * Listar comentários de utilizador (moderação)
   *
   * @async
   * @route GET /comment/user/:publicId/manage
   * @protected Requer autenticação JWT e permissão VIEW_ALL_COMMENTS
   * @param {string} publicId - Identificador público do utilizador
   * @param {GetCommentsManageRequestDto} getByToiletsRequestDto - Parâmetros de paginação, filtros e estado
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} Lista de comentários do utilizador
   * @throws {NotFoundException} Se utilizador não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão VIEW_ALL_COMMENTS
   *
   * @description
   * Lista TODOS os comentários de um utilizador específico.
   * Suporta filtro por estado de comentário. Usado por moderadores.
   */
  @ApiSwaggerGetCommentsByUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_COMMENTS)
  @Get('user/:publicId/manage')
  async getCommentsByUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsManageRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, commentState, timestamp } =
      getByToiletsRequestDto || {};
    const result = await this.getCommentsByUserPublicIdUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_USER_SUCCESS,
      result,
    );
  }

  /**
   * Criar comentário
   *
   * @async
   * @route POST /comment
   * @protected Requer autenticação JWT e permissão CREATE_COMMENTS
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {CreateCommentRequestDto} createCommentDto - Dados do comentário (toilet, texto, avaliação)
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário criado
   * @throws {NotFoundException} Se toilet não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão CREATE_COMMENTS
   *
   * @description
   * Cria novo comentário em toilet com texto opcional e avaliação obrigatória.
   * Avaliação inclui: clean, paper, structure, accessibility.
   */
  @ApiSwaggerCreateComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.CREATE_COMMENTS)
  @Post('')
  async postComment(
    @User() user: jwtTypes.RequestUser,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const { toiletPublicId, text, rate } = createCommentDto;
    const { clean, paper, structure, accessibility } = rate;

    const comment = await this.createCommentUseCase.execute(
      user.id,
      toiletPublicId,
      clean,
      paper,
      structure,
      accessibility,
      text,
    );

    return new ApiResponseDto(COMMENT_MESSAGES.CREATE_COMMENT_SUCCESS, comment);
  }

  /**
   * Atualizar próprio comentário
   *
   * @async
   * @route PATCH /comment/:publicId
   * @protected Requer autenticação JWT e permissão EDIT_SELF_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {UpdateCommentRequestDto} updateCommentDto - Novos dados do comentário
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário atualizado
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token inválido, ausente ou utilizador não é o autor
   * @throws {ForbiddenException} Se utilizador não possuir permissão EDIT_SELF_COMMENTS
   *
   * @description
   * Atualiza texto e/ou avaliação do próprio comentário.
   * Apenas o autor pode editar seu comentário.
   */
  @ApiSwaggerUpdateComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_SELF_COMMENTS)
  @Patch(':publicId')
  async patchComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
    @Body() updateCommentDto: UpdateCommentRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const { text, rate } = updateCommentDto;
    const { clean, paper, structure, accessibility } = rate || {};

    const comment = await this.updateCommentUseCase.execute(
      publicId,
      user.id,
      text,
      clean,
      paper,
      structure,
      accessibility,
    );

    return new ApiResponseDto(COMMENT_MESSAGES.UPDATE_COMMENT_SUCCESS, comment);
  }

  /**
   * Atualizar qualquer comentário (moderação)
   *
   * @async
   * @route PATCH /comment/:publicId/manage
   * @protected Requer autenticação JWT e permissão EDIT_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @param {UpdateCommentRequestDto} updateCommentDto - Novos dados do comentário
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário atualizado
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão EDIT_COMMENTS
   *
   * @description
   * Atualiza texto e/ou avaliação de qualquer comentário.
   * Não verifica propriedade - usado por moderadores.
   */
  @ApiSwaggerUpdateCommentManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.EDIT_COMMENTS)
  @Patch(':publicId/manage')
  async patchCommentManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() updateCommentDto: UpdateCommentRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const { text, rate } = updateCommentDto;
    const { clean, paper, structure, accessibility } = rate || {};

    const comment = await this.updateCommentManageUseCase.execute(
      publicId,
      text,
      clean,
      paper,
      structure,
      accessibility,
    );

    return new ApiResponseDto(
      COMMENT_MESSAGES.UPDATE_COMMENT_MANAGE_SUCCESS,
      comment,
    );
  }

  /**
   * Deletar próprio comentário
   *
   * @async
   * @route DELETE /comment/:publicId
   * @protected Requer autenticação JWT e permissão DELETE_SELF_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token inválido, ausente ou utilizador não é o autor
   * @throws {ForbiddenException} Se utilizador não possuir permissão DELETE_SELF_COMMENTS
   *
   * @description
   * Soft delete do próprio comentário. Apenas o autor pode deletar.
   * Pode ser recuperado antes do período de retenção expirar.
   */
  @ApiSwaggerDeleteComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_SELF_COMMENTS)
  @Delete(':publicId')
  async deleteComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteCommentUseCase.execute(publicId, user.id);
    return new ApiResponseDto(COMMENT_MESSAGES.DELETE_COMMENT_SUCCESS);
  }

  /**
   * Deletar qualquer comentário (moderação)
   *
   * @async
   * @route DELETE /comment/:publicId/manage
   * @protected Requer autenticação JWT e permissão DELETE_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @param {jwtTypes.RequestUser} user - Moderador autenticado (extraído do JWT)
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão DELETE_COMMENTS
   *
   * @description
   * Soft delete de qualquer comentário. Não verifica propriedade.
   * Usado por moderadores. Pode ser recuperado antes de expirar.
   */
  @ApiSwaggerDeleteCommentManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_COMMENTS)
  @Delete(':publicId/manage')
  async deleteCommentManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteCommentManageUseCase.execute(publicId, user.id);
    return new ApiResponseDto(COMMENT_MESSAGES.DELETE_COMMENT_MANAGE_SUCCESS);
  }

  /**
   * Reagir a comentário
   *
   * @async
   * @route PUT /comment/:publicId/react
   * @protected Requer autenticação JWT e permissão REACT_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @param {jwtTypes.RequestUser} user - Utilizador autenticado (extraído do JWT)
   * @param {PutReactRequestDto} putReactRequestDto - Tipo de reação (LIKE/DISLIKE)
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário com reações atualizadas
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão REACT_COMMENTS
   *
   * @description
   * Adiciona, remove ou altera reação (like/dislike) em comentário.
   * Comportamento idempotente: mesma reação remove, reação diferente substitui.
   */
  @ApiSwaggerPutReact()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.REACT_COMMENTS)
  @Put(':publicId/react')
  async putReactToComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
    @Query() putReactRequestDto: PutReactRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const { react } = putReactRequestDto;
    const comment = await this.putReactUseCase.execute(
      user.id,
      publicId,
      react as unknown as ReactDiscriminator,
    );
    return new ApiResponseDto<CommentResponseDto>(
      COMMENT_MESSAGES.REACT_TO_COMMENT_SUCCESS,
      comment,
    );
  }

  /**
   * Mostrar comentário (moderação)
   *
   * @async
   * @route PUT /comment/:publicId/show
   * @protected Requer autenticação JWT e permissão SHOW_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário tornado visível
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão SHOW_COMMENTS
   * @throws {ConflictException} Se comentário foi deletado
   *
   * @description
   * Torna comentário visível publicamente alterando estado de HIDDEN para VISIBLE.
   * Usado por moderadores.
   */
  @ApiSwaggerShowComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SHOW_COMMENTS)
  @Put(':publicId/show')
  async showComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const comment = await this.showCommentUseCase.execute(publicId);
    return new ApiResponseDto<CommentResponseDto>(
      COMMENT_MESSAGES.SHOW_COMMENT_SUCCESS,
      comment,
    );
  }

  /**
   * Ocultar comentário (moderação)
   *
   * @async
   * @route PUT /comment/:publicId/hide
   * @protected Requer autenticação JWT e permissão HIDE_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário ocultado
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão HIDE_COMMENTS
   * @throws {ConflictException} Se comentário foi deletado
   *
   * @description
   * Oculta comentário do público alterando estado de VISIBLE para HIDDEN sem deletar.
   * Usado por moderadores.
   */
  @ApiSwaggerHideComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.HIDE_COMMENTS)
  @Put(':publicId/hide')
  async hideComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const comment = await this.hideCommentUseCase.execute(publicId);
    return new ApiResponseDto<CommentResponseDto>(
      COMMENT_MESSAGES.HIDE_COMMENT_SUCCESS,
      comment,
    );
  }

  /**
   * Recuperar comentário deletado (moderação)
   *
   * @async
   * @route PUT /comment/:publicId/undelete
   * @protected Requer autenticação JWT e permissão UNDELETE_COMMENTS
   * @param {string} publicId - Identificador público do comentário
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} Comentário recuperado
   * @throws {NotFoundException} Se comentário não existir
   * @throws {UnauthorizedException} Se token de autenticação for inválido ou ausente
   * @throws {ForbiddenException} Se utilizador não possuir permissão UNDELETE_COMMENTS
   *
   * @description
   * Recupera comentário soft-deleted revertendo soft delete e restaurando estado VISIBLE.
   * Usado por moderadores. Apenas funciona para comentários que ainda não expiraram.
   */
  @ApiSwaggerUndeleteComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.UNDELETE_COMMENTS)
  @Put(':publicId/undelete')
  async undeleteComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
  ): Promise<ApiResponseDto<CommentResponseDto>> {
    const comment = await this.undeleteCommentUseCase.execute(publicId);
    return new ApiResponseDto<CommentResponseDto>(
      COMMENT_MESSAGES.UNDELETE_COMMENT_SUCCESS,
      comment,
    );
  }
}
