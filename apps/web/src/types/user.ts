import { Role } from './api';

export interface UserSelfResponseDto {
  publicId: string;
  name: string;
  icon: string;
  commentsCount: number;
  email: string;
  points: number;
  birthDate: string;
  isPartner: boolean;
  roles: Role[];
  createdAt: string;
}

export interface UserAdminResponseDto {
  publicId: string;
  name: string;
  icon: string;
  commentsCount: number;
  email: string;
  points: number;
  birthDate: string;
  isPartner: boolean;
  roles: Role[];
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
}

export interface UserCommentResponseDto {
  publicId: string;
  name: string;
  icon: string;
  commentsCount: number;
}

export interface UserSuggestionResponseDto {
  publicId: string;
  name: string;
  icon: string;
  commentsCount: number;
  email: string;
}

export interface AssignRolesManageRequestDto {
  roles: string[];
}

export interface RemoveRolesManageRequestDto {
  roles: string[];
}

export interface UpdateUserRequestDto {
  name?: string;
  birthDate?: string;
}

export interface DeleteUserSelfRequestDto {
  password: string;
}
