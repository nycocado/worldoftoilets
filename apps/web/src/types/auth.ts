import { Role } from './api';

// Re-export for convenience
export type { Role };

export interface User {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserLoginResponseDto;
}

export interface UserLoginResponseDto {
  publicId: string;
  name: string;
  icon: string;
  commentsCount: number;
  email: string;
  roles: Role[];
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface RegisterAdminRequestDto {
  register: RegisterRequestDto;
  roles: string[];
}

export interface CsrfTokenResponseDto {
  csrfToken: string;
}
