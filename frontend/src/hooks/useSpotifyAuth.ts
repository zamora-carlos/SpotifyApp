import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import type { TokenResponse } from 'types/token-response.types';

function useSpotifyAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const calledRef = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (!code || calledRef.current) return;
    calledRef.current = true;

    const authenticate = async () => {
      try {
        const response = await fetch(
          'http://localhost:9090/api/v1/auth/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to authenticate: ${response.statusText}`);
        }

        const data: TokenResponse = await response.json();
        console.log(data);

        login(data);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Spotify auth failed:', error);
        navigate('/login', { replace: true });
      }
    };

    authenticate();
  }, [location.search, navigate, login]);
}

export default useSpotifyAuth;
