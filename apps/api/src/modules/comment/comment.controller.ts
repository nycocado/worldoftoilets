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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Put(':publicId/react')
  @RequiresPermissions(PermissionApiName.REACT_COMMENTS)
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
