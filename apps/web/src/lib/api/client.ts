import type { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// CSRF token management
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getCsrfTokenValue(): string | null {
  return csrfToken;
}

// Extended options for API calls
interface ApiClientOptions extends RequestInit {
  skipRefresh?: boolean; // If true, won't attempt to refresh token on 401
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { skipRefresh = false, ...fetchOptions } = options;
  const method = fetchOptions.method?.toUpperCase() || 'GET';
  const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  // Build headers with CSRF token if needed
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (requiresCsrf && csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: 'include',
    headers,
  });

  // If 401 and refresh is allowed, try refreshing token
  if (response.status === 401 && !skipRefresh) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry request with new token
      response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: 'include',
        headers,
      });
    } else {
      throw new ApiError(401, 'Session expired');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `API Error: ${response.status}`
    );
  }

  return response.json();
}

// Helper for multipart/form-data requests (file uploads)
export async function apiClientFormData<T>(
  endpoint: string,
  formData: FormData,
  skipRefresh = false
): Promise<ApiResponse<T>> {
  // Build headers with CSRF token
  const headers: Record<string, string> = {};
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    headers,
    // Don't set Content-Type header, browser will set it with boundary
  });

  // If 401 and refresh is allowed, try refreshing token
  if (response.status === 401 && !skipRefresh) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers,
      });
    } else {
      throw new ApiError(401, 'Session expired');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `API Error: ${response.status}`
    );
  }

  return response.json();
}
