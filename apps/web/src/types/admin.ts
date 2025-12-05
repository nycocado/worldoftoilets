import type { User } from './auth';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Management Types
export interface UserFilters extends PaginationParams {
  roles?: string[];
  isEmailVerified?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  isEmailVerified?: boolean;
  roles?: string[];
}

// Establishment Types
export interface Establishment {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  totalRatings: number;
  accessibility: {
    hasBabyChanging: boolean;
    hasHandrail: boolean;
    hasWheelchairAccess: boolean;
  };
  amenities: {
    hasBidet: boolean;
    hasShower: boolean;
    hasSoap: boolean;
    hasToiletPaper: boolean;
  };
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface EstablishmentFilters extends PaginationParams {
  minRating?: number;
  maxRating?: number;
}

// Partner Application Types
export type PartnerApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PartnerApplication {
  id: string;
  user: User;
  establishmentName: string;
  establishmentAddress: string;
  establishmentDescription?: string;
  contactPhone: string;
  status: PartnerApplicationStatus;
  reviewedBy?: User;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerApplicationFilters extends PaginationParams {
  status?: PartnerApplicationStatus[];
}

export interface ReviewPartnerApplicationDto {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

// Report Types
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type ReportType = 'comment' | 'reply' | 'user';

export interface Report {
  id: string;
  type: ReportType;
  reason: string;
  description?: string;
  status: ReportStatus;
  reporter: User;
  reportedComment?: {
    id: string;
    content: string;
    author: User;
  };
  reportedReply?: {
    id: string;
    content: string;
    author: User;
  };
  reportedUser?: User;
  reviewedBy?: User;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters extends PaginationParams {
  type?: ReportType[];
  status?: ReportStatus[];
}

export interface ResolveReportDto {
  status: 'resolved' | 'dismissed';
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  establishment: {
    id: string;
    name: string;
    address: string;
  };
  rating?: {
    clean: number;
    paper: boolean;
    structure: number;
    accessibility: number;
  };
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentFilters extends PaginationParams {
  establishmentId?: string;
  authorId?: string;
}

export interface UpdateCommentDto {
  content?: string;
}

// Reply Types
export interface Reply {
  id: string;
  content: string;
  author: User;
  comment: {
    id: string;
    content: string;
  };
  createdAt: string;
  updatedAt: string;
}
