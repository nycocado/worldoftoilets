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
 * Gerencia as requisições HTTP para operações relacionadas a comentários.
 */
@Controller('comment')
export class CommentController {
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
   * Lista os comentários visíveis de um sanitário específico.
   *
   * @param {string} publicId O identificador público do sanitário.
   * @param {GetCommentsRequestDto} getByToiletsRequestDto DTO com parâmetros de paginação e filtros.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} A lista de comentários.
   * @throws {NotFoundException} Se o sanitário não for encontrado.
   */
  @ApiSwaggerGetCommentsByToilet()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_COMMENTS)
  @Get('toilet/:publicId')
  async getCommentsByToilet(
    @Param('publicId') publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsRequestDto,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, timestamp } = getByToiletsRequestDto || {};

    const result = await this.getCommentsByToiletPublicIdUseCase.execute(
      publicId,
      pageable,
      page,
      size,
      CommentState.VISIBLE,
      timestamp,
      user.publicId,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_TOILET_SUCCESS,
      result,
    );
  }

  /**
   * Lista todos os comentários de um sanitário para fins de moderação.
   *
   * @param {string} publicId O identificador público do sanitário.
   * @param {GetCommentsManageRequestDto} getByToiletsRequestDto DTO com parâmetros de paginação e filtros de estado.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} A lista de comentários.
   * @throws {NotFoundException} Se o sanitário não for encontrado.
   */
  @ApiSwaggerGetCommentsByToiletManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_COMMENTS)
  @Get('toilet/:publicId/manage')
  async getCommentsByToiletManage(
    @Param('publicId') publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsManageRequestDto,
    @User() user: jwtTypes.RequestUser,
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
      user.publicId,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_TOILET_MANAGE_SUCCESS,
      result,
    );
  }

  /**
   * Lista os comentários visíveis do próprio utilizador autenticado.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {GetCommentsRequestDto} getByToiletsRequestDto DTO com parâmetros de paginação e filtros.
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} A lista de comentários do utilizador.
   */
  @ApiSwaggerGetCommentsByUserSelf()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_COMMENTS)
  @Get('user/self')
  async getCommentsByMyUser(
    @User() user: jwtTypes.RequestUser,
    @Query() getByToiletsRequestDto: GetCommentsRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, timestamp } = getByToiletsRequestDto || {};

    const result = await this.getCommentsByUserIdUseCase.execute(
      user.publicId,
      pageable,
      page,
      size,
      CommentState.VISIBLE,
      timestamp,
      user.publicId,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_SELF_USER_SUCCESS,
      result,
    );
  }

  /**
   * Lista todos os comentários de um utilizador específico para fins de moderação.
   *
   * @param {string} publicId O identificador público do utilizador.
   * @param {GetCommentsManageRequestDto} getByToiletsRequestDto DTO com parâmetros de paginação e filtros de estado.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto<CommentResponseDto[]>>} A lista de comentários do utilizador.
   * @throws {NotFoundException} Se o utilizador não for encontrado.
   */
  @ApiSwaggerGetCommentsByUserManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_ALL_COMMENTS)
  @Get('user/:publicId/manage')
  async getCommentsByUserManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Query() getByToiletsRequestDto: GetCommentsManageRequestDto,
    @User() user: jwtTypes.RequestUser,
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
      user.publicId,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_USER_SUCCESS,
      result,
    );
  }

  /**
   * Cria um novo comentário para um sanitário.
   *
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {CreateCommentRequestDto} createCommentDto DTO com os dados do novo comentário.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário criado.
   * @throws {NotFoundException} Se o sanitário não for encontrado.
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
      user.publicId,
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
   * Atualiza o próprio comentário.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {UpdateCommentRequestDto} updateCommentDto DTO com os dados a serem atualizados.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {UnauthorizedException} Se o utilizador não for o autor do comentário.
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
      user.publicId,
      text,
      clean,
      paper,
      structure,
      accessibility,
    );

    return new ApiResponseDto(COMMENT_MESSAGES.UPDATE_COMMENT_SUCCESS, comment);
  }

  /**
   * Atualiza um comentário para fins de moderação.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {UpdateCommentRequestDto} updateCommentDto DTO com os dados a serem atualizados.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
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
   * Realiza o soft delete do próprio comentário.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {UnauthorizedException} Se o utilizador não for o autor do comentário.
   */
  @ApiSwaggerDeleteComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_SELF_COMMENTS)
  @Delete(':publicId')
  async deleteComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteCommentUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(COMMENT_MESSAGES.DELETE_COMMENT_SUCCESS);
  }

  /**
   * Realiza o soft delete de um comentário para fins de moderação.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {jwtTypes.RequestUser} user O moderador autenticado.
   * @returns {Promise<ApiResponseDto>} Confirmação de sucesso.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @ApiSwaggerDeleteCommentManage()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.DELETE_COMMENTS)
  @Delete(':publicId/manage')
  async deleteCommentManage(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteCommentManageUseCase.execute(publicId, user.publicId);
    return new ApiResponseDto(COMMENT_MESSAGES.DELETE_COMMENT_MANAGE_SUCCESS);
  }

  /**
   * Adiciona, remove ou altera uma reação (like/dislike) a um comentário.
   *
   * @param {string} publicId O identificador público do comentário.
   * @param {jwtTypes.RequestUser} user O utilizador autenticado.
   * @param {PutReactRequestDto} putReactRequestDto DTO com o tipo de reação.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário com as reações atualizadas.
   * @throws {NotFoundException} Se o comentário não for encontrado.
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
      user.publicId,
      publicId,
      react as unknown as ReactDiscriminator,
    );
    return new ApiResponseDto<CommentResponseDto>(
      COMMENT_MESSAGES.REACT_TO_COMMENT_SUCCESS,
      comment,
    );
  }

  /**
   * Torna um comentário visível (moderação).
   *
   * @param {string} publicId O identificador público do comentário.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {ConflictException} Se o comentário já foi deletado.
   */
  @ApiSwaggerShowComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.SHOW_COMMENTS)
  @Put(':publicId/manage/show')
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
   * Oculta um comentário (moderação).
   *
   * @param {string} publicId O identificador público do comentário.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário atualizado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   * @throws {ConflictException} Se o comentário já foi deletado.
   */
  @ApiSwaggerHideComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.HIDE_COMMENTS)
  @Put(':publicId/manage/hide')
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
   * Recupera um comentário que sofreu soft delete (moderação).
   *
   * @param {string} publicId O identificador público do comentário.
   * @returns {Promise<ApiResponseDto<CommentResponseDto>>} O comentário recuperado.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  @ApiSwaggerUndeleteComment()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.UNDELETE_COMMENTS)
  @Put(':publicId/manage/undelete')
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
