import apiFetch from './apiClient';
import type { TokenResponse } from 'types/token-response.types';

export function exchangeCode(code: string): Promise<TokenResponse> {
  return apiFetch('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
}

export function refreshToken(accessToken: string): Promise<TokenResponse> {
  return apiFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken }),
  });
}
