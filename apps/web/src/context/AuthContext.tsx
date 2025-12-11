'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { UserSelfResponseDto } from '@/types/user';
import type { Role } from '@/types/api';
import { apiClient, setAccessToken } from '@/lib/api/client';
import {
  logout as apiLogout,
  refreshToken as apiRefreshToken,
} from '@/lib/api/auth';
import { useCsrf } from './CsrfContext';

interface AuthContextType {
  user: UserSelfResponseDto | null;
  isLoading: boolean;
  roles: Role[];
  hasRole: (apiName: string) => boolean;
  hasAnyRole: (apiNames: string[]) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes where we should NOT attempt to load the user session
const PUBLIC_ONLY_ROUTES = ['/auth/reset-password', '/auth/verify-email'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSelfResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isCsrfLoading } = useCsrf();
  const router = useRouter();
  const pathname = usePathname();

  const roles = user?.roles || [];

  const hasRole = (apiName: string) => {
    return roles.some((role) => role.apiName === apiName);
  };

  const hasAnyRole = (apiNames: string[]) => {
    return roles.some((role) => apiNames.includes(role.apiName));
  };

  const loadUser = async () => {
    try {
      // Attempt to refresh token first to warm up the in-memory access token
      try {
        const refreshRes = await apiRefreshToken();
        if (refreshRes.data.accessToken) {
          setAccessToken(refreshRes.data.accessToken);
        }
      } catch (e) {
        // Silent fail on refresh - user might not be logged in
      }

      const response = await apiClient<UserSelfResponseDto>('/user/self', {
        method: 'GET',
      });
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore errors on logout
    } finally {
      setAccessToken(null); // Clear in-memory access token immediately
      setUser(null);
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    if (isCsrfLoading) return;

    // Skip user loading for specific public routes to avoid unnecessary API calls/errors
    if (PUBLIC_ONLY_ROUTES.some((route) => pathname?.startsWith(route))) {
      setIsLoading(false);
      return;
    }

    loadUser();
  }, [isCsrfLoading, pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        roles,
        hasRole,
        hasAnyRole,
        logout,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
