import type { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
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

// Access Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Extended options for API calls
interface ApiClientOptions extends RequestInit {
  skipRefresh?: boolean; // If true, won't attempt to refresh token on 401
  skipAuthHeader?: boolean; // If true, won't attach Authorization header
}

// Helper to refresh CSRF token
async function refreshCsrfToken(): Promise<boolean> {
  try {
    const csrfRes = await fetch(`${API_URL}/auth/csrf-token`, {
      credentials: 'include',
    });
    if (csrfRes.ok) {
      const data = await csrfRes.json();
      if (data.csrfToken) {
        setCsrfToken(data.csrfToken);
        console.log('CSRF token refreshed successfully.');
        return true;
      }
    }
    console.warn('Failed to get new CSRF token from API.');
    return false;
  } catch (e) {
    console.error('Error refreshing CSRF token:', e);
    return false;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    // Ensure CSRF is valid for the refresh call itself
    await refreshCsrfToken();

    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // ONLY here we send the cookie
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        console.log('Access token refreshed successfully.');
        return true;
      }
    }
    console.warn('Failed to get new Access Token from refresh API.');
    return false;
  } catch (e) {
    console.error('Error refreshing Access Token:', e);
    return false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const { skipRefresh = false, skipAuthHeader = false, ...fetchOptions } =
    options;
  const method = fetchOptions.method?.toUpperCase() || 'GET';
  const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuthHeader && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (requiresCsrf && csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include', // Required for backend CSRF session identifier (cookie 'token')
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .clone()
      .json()
      .catch(() => ({}));

    // Handle CSRF Error (403 or specific message) - Retry logic
    if (
      response.status === 403 ||
      (errorData.message && errorData.message.toLowerCase().includes('csrf'))
    ) {
      console.warn(
        'API Error (Potential CSRF), attempting retry:',
        response.status,
        errorData,
      );
      const csrfRefreshed = await refreshCsrfToken();

      if (csrfRefreshed && csrfToken) {
        headers['x-csrf-token'] = csrfToken;
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

        response = await fetch(`${API_URL}${endpoint}`, {
          credentials: 'include',
          ...fetchOptions,
          headers,
        });
      }
    }

    // If 401 and refresh is allowed, try refreshing token
    if (response.status === 401 && !skipRefresh) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        if (csrfToken) headers['x-csrf-token'] = csrfToken;

        response = await fetch(`${API_URL}${endpoint}`, {
          credentials: 'include',
          ...fetchOptions,
          headers,
        });
      } else {
        throw new ApiError(401, 'Session expired');
      }
    }
  }

  if (!response.ok) {
    const finalErrorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      finalErrorData.message || `API Error: ${response.status}`,
    );
  }

  return response.json();
}

// Helper for multipart/form-data requests (file uploads)
export async function apiClientFormData<T>(
  endpoint: string,
  formData: FormData,
  skipRefresh = false,
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
      errorData.message || `API Error: ${response.status}`,
    );
  }

  return response.json();
}
