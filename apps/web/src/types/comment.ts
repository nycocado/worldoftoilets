import { CommentRateCommentResponseDto } from './api';
import { UserCommentResponseDto } from './user';
import { ToiletResponseDto } from './toilet';

export interface CommentResponseDto {
  publicId: string;
  text: string | null;
  score: number;
  rate: CommentRateCommentResponseDto;
  reactCounts: ReactCommentResponseDto;
  replyCount: number;
  user: UserCommentResponseDto;
  toilet: ToiletResponseDto | null;
  myReact: 'like' | 'dislike' | null;
  createdAt: string;
}

export interface ReactCommentResponseDto {
  like: number;
  dislike: number;
}

export interface CreateCommentRequestDto {
  toiletPublicId: string;
  text?: string;
  rate: {
    clean: number;
    paper: boolean;
    structure: number;
    accessibility: number;
  };
}

export interface UpdateCommentRequestDto {
  text?: string;
  rate?: {
    clean?: number;
    paper?: boolean;
    structure?: number;
    accessibility?: number;
  };
}

export interface ReplyResponseDto {
  publicId: string;
  text: string;
  user: UserCommentResponseDto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReplyRequestDto {
  commentPublicId: string;
  text: string;
}

export interface UpdateReplyRequestDto {
  text: string;
}
