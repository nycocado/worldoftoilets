import { ToiletResponseDto } from './toilet';
import { UserSuggestionResponseDto } from './user';
import { CommentResponseDto } from './comment';

// Report Types
export type ToiletReportType =
  | 'fake-information'
  | 'unsanitary-conditions'
  | 'privacy-violation'
  | 'maintenance-needed'
  | 'damaged-equipment'
  | 'others';
export type CommentReportType =
  | 'not-useful'
  | 'fake-information'
  | 'inappropriate-content'
  | 'offensive-content'
  | 'spam'
  | 'others';
export type UserReportType =
  | 'harassment-abuse'
  | 'fake-account'
  | 'impersonation'
  | 'hate-speech'
  | 'privacy-violation'
  | 'spam'
  | 'others';
export type ReplyReportType =
  | 'not-useful'
  | 'fake-information'
  | 'inappropriate-content'
  | 'offensive-content'
  | 'spam'
  | 'others';

export type ReportStatus = 'pending' | 'accepted' | 'rejected';

// Toilet Reports
export interface TypeReportToiletResponseDto {
  name: string;
  apiName: ToiletReportType;
}

export interface ReportToiletResponseDto {
  publicId: string;
  type: TypeReportToiletResponseDto;
  toilet: ToiletResponseDto;
  reportedBy: UserSuggestionResponseDto;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportToiletListResponseDto {
  toilet: ToiletResponseDto;
  count: number;
  mostFrequent: TypeReportToiletResponseDto;
}

export interface ReportToiletDetailResponseDto {
  toilet: ToiletResponseDto;
  reports: ReportToiletResponseDto[];
  totalCount: number;
  breakdown: {
    type: TypeReportToiletResponseDto;
    count: number;
  }[];
}

export interface CreateReportToiletRequestDto {
  toiletPublicId: string;
  typeReportToilet: ToiletReportType;
}

// Comment Reports
export interface TypeReportCommentResponseDto {
  name: string;
  apiName: CommentReportType;
}

export interface ReportCommentResponseDto {
  publicId: string;
  type: TypeReportCommentResponseDto;
  comment: CommentResponseDto;
  reportedBy: UserSuggestionResponseDto;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportCommentListResponseDto {
  comment: CommentResponseDto;
  count: number;
  mostFrequent: TypeReportCommentResponseDto;
}

export interface CreateReportCommentRequestDto {
  commentPublicId: string;
  typeReportComment: CommentReportType;
}

// User Reports
export interface TypeReportUserResponseDto {
  name: string;
  apiName: UserReportType;
}

export interface ReportUserResponseDto {
  publicId: string;
  type: TypeReportUserResponseDto;
  reportedUser: UserSuggestionResponseDto;
  reportedBy: UserSuggestionResponseDto;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportUserListResponseDto {
  reportedUser: UserSuggestionResponseDto;
  count: number;
  mostFrequent: TypeReportUserResponseDto;
}

export interface CreateReportUserRequestDto {
  reportedUserPublicId: string;
  type: UserReportType;
}

// Reply Reports
export interface ReportReplyListResponseDto {
  reply: {
    publicId: string;
    text: string;
    user: UserSuggestionResponseDto;
    createdAt: string;
  };
  count: number;
  mostFrequent: {
    name: string;
    apiName: ReplyReportType;
  };
}
