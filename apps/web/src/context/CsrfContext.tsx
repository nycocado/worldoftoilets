'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getCsrfToken } from '@/lib/api/auth';
import { setCsrfToken as setClientCsrfToken } from '@/lib/api/client';

interface CsrfContextType {
  csrfToken: string | null;
  isLoading: boolean;
  refreshCsrfToken: () => Promise<void>;
}

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export function CsrfProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCsrfToken = async () => {
    try {
      const response = await getCsrfToken();
      const token = response.data.csrfToken;
      setCsrfToken(token);
      // Inject token into apiClient
      setClientCsrfToken(token);
    } catch (error) {
      console.warn('CSRF token not available:', error);
      // Don't throw - allow app to continue without CSRF protection
      // The backend may not have CSRF enabled yet
      setCsrfToken(null);
      setClientCsrfToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider
      value={{
        csrfToken,
        isLoading,
        refreshCsrfToken: loadCsrfToken,
      }}
    >
      {children}
    </CsrfContext.Provider>
  );
}

export const useCsrf = () => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error('useCsrf must be used within CsrfProvider');
  }
  return context;
};
