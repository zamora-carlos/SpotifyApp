import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { exchangeCode } from '@lib/authApi';

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
        const data = await exchangeCode(code);
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
