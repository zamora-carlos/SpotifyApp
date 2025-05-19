import { refreshToken } from '@lib/authApi';
import { createContext, useContext, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { TokenResponse } from 'types/tokenResponse.types';

type AuthContextType = {
  isAuthenticated: () => boolean;
  login: (tokenResponse: TokenResponse) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshPromise = useRef<Promise<string | null> | null>(null);

  const login = useCallback((tokenResponse: TokenResponse) => {
    const expiresAt = new Date(tokenResponse.expiresAt).getTime();
    localStorage.setItem('accessToken', tokenResponse.accessToken);
    localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiresAt');
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const bufferMs = 10_000;

    const storedToken = localStorage.getItem('accessToken');
    const storedExpiresAt = localStorage.getItem('accessTokenExpiresAt');
    const expiresAt = storedExpiresAt ? Number(storedExpiresAt) : null;

    if (storedToken && expiresAt && Date.now() < expiresAt - bufferMs) {
      return storedToken;
    }

    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    if (storedToken && expiresAt) {
      refreshPromise.current = (async () => {
        try {
          const data = await refreshToken(storedToken);
          login(data);
          return data.accessToken;
        } catch (error) {
          console.error('Error refreshing token:', error);
          logout();
          return null;
        } finally {
          refreshPromise.current = null;
        }
      })();

      return refreshPromise.current;
    }

    logout();
    return null;
  }, [login, logout]);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const expiresAt = localStorage.getItem('accessTokenExpiresAt');
    return (
      token !== null && expiresAt !== null && Date.now() < Number(expiresAt)
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
