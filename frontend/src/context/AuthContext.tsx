import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type { TokenResponse } from 'types/token-response.types';

type AuthContextType = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenResponse: TokenResponse) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedExpiresAt = localStorage.getItem('accessTokenExpiresAt');

    if (storedToken && storedExpiresAt) {
      setAccessToken(storedToken);
      setAccessTokenExpiresAt(Number(storedExpiresAt));
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((tokenResponse: TokenResponse) => {
    const expiresAt = new Date(tokenResponse.expiresAt).getTime();

    setAccessToken(tokenResponse.accessToken);
    setAccessTokenExpiresAt(expiresAt);

    localStorage.setItem('accessToken', tokenResponse.accessToken);
    localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setAccessTokenExpiresAt(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiresAt');
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const bufferMs = 10_000;

    if (
      accessToken &&
      accessTokenExpiresAt &&
      Date.now() < accessTokenExpiresAt - bufferMs
    ) {
      return accessToken;
    }

    if (
      accessToken &&
      accessTokenExpiresAt &&
      Date.now() >= accessTokenExpiresAt - bufferMs
    ) {
      try {
        const response = await fetch(
          'http://localhost:9090/api/v1/auth/refresh',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to refresh token: ${response.statusText}`);
        }

        const data: TokenResponse = await response.json();
        login(data);
        return data.accessToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
        return null;
      }
    }

    logout();
    return null;
  }, [accessToken, accessTokenExpiresAt, login, logout]);

  const isAuthenticated = useMemo(() => {
    return (
      accessToken !== null &&
      accessTokenExpiresAt !== null &&
      Date.now() < accessTokenExpiresAt
    );
  }, [accessToken, accessTokenExpiresAt]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
