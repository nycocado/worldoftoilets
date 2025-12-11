import { apiClient } from './client';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterAdminRequestDto,
  RefreshTokenResponseDto,
  CsrfTokenResponseDto,
} from '@/types/auth';

export async function login(credentials: LoginRequestDto) {
  return apiClient<LoginResponseDto>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipRefresh: true, // Don't attempt refresh on login
  });
}

export async function register(data: RegisterRequestDto) {
  return apiClient<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipRefresh: true,
  });
}

export async function registerAdmin(data: RegisterAdminRequestDto) {
  return apiClient<{ message: string }>('/auth/register/admin', {
    method: 'POST',
    body: JSON.stringify(data),
    skipRefresh: true,
  });
}

export async function refreshToken() {
  return apiClient<RefreshTokenResponseDto>('/auth/refresh', {
    method: 'POST',
    skipRefresh: true, // Obviously don't retry refresh on refresh
  });
}

export async function logout() {
  return apiClient<{ message: string }>('/auth/logout', {
    method: 'POST',
    skipAuthHeader: true, // Do not send Access Token, rely on Refresh Token cookie
  });
}

export async function logoutAll() {
  return apiClient<{ message: string }>('/auth/logout-all', {
    method: 'POST',
  });
}

export async function verifyEmail(token: string) {
  return apiClient<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    skipRefresh: true,
  });
}

export async function resendVerification(email: string) {
  return apiClient<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipRefresh: true,
  });
}

export async function forgotPassword(email: string) {
  return apiClient<{ message: string }>(
    `/auth/forgot-password?email=${encodeURIComponent(email)}`,
    {
      method: 'POST',
      skipRefresh: true,
    },
  );
}

export async function resetPassword(token: string, newPassword: string) {
  return apiClient<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
    skipRefresh: true,
  });
}

export async function getCsrfToken(token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiClient<CsrfTokenResponseDto>('/auth/csrf-token', {
    method: 'GET',
    headers,
    skipRefresh: true,
    credentials: 'include',
  });
}
