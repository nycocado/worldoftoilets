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
import { CommentService } from './comment.service';
import { GetToiletsRequestDto } from '@modules/comment/dto/get-toilets-request.dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { CommentResponseDto } from '@modules/comment/dto/comment-response.dto';
import { JwtAuthGuard, PermissionsGuard } from '@common/guards';
import { RequiresPermissions, User } from '@common/decorators';
import { PermissionApiName, ReactDiscriminator } from '@database/entities';
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
  UpdateCommentUseCase,
} from '@modules/comment/use-cases';
import { PutReactUseCase } from '@modules/comment/use-cases/put-react.use-case';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly getCommentsByToiletPublicIdUseCase: GetCommentsByToiletPublicIdUseCase,
    private readonly getCommentsByUserIdUseCase: GetCommentsByUserIdUseCase,
    private readonly putReactUseCase: PutReactUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions(PermissionApiName.VIEW_COMMENTS)
  @Get('toilet/:id')
  async getCommentsByToilet(
    @Param('id') publicId: string,
    @Query() getByToiletsRequestDto: GetToiletsRequestDto,
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
      COMMENT_MESSAGES.GET_BY_TOILET_SUCCESS,
      result,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/self')
  async getCommentsByMyUser(
    @User() user: jwtTypes.RequestUser,
    @Query() getByToiletsRequestDto: GetToiletsRequestDto,
  ): Promise<ApiResponseDto<CommentResponseDto[]>> {
    const { pageable, page, size, commentState, timestamp } =
      getByToiletsRequestDto || {};

    const result = await this.getCommentsByUserIdUseCase.execute(
      user.id,
      pageable,
      page,
      size,
      commentState,
      timestamp,
    );

    return new ApiResponseDto<CommentResponseDto[]>(
      COMMENT_MESSAGES.GET_BY_SELF_USER_SUCCESS,
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
  @RequiresPermissions(PermissionApiName.CREATE_COMMENTS)
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
  @RequiresPermissions(PermissionApiName.CREATE_COMMENTS)
  @Delete(':publicId')
  async deleteComment(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @User() user: jwtTypes.RequestUser,
  ): Promise<ApiResponseDto> {
    await this.deleteCommentUseCase.execute(publicId, user.id);
    return new ApiResponseDto(COMMENT_MESSAGES.DELETE_COMMENT_SUCCESS);
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
}
