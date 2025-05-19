import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import HeroSection from '@components/HeroSection';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get('authError');

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <HeroSection
      authError={authError ? 'Authorization failed. Please try again.' : ''}
    />
  );
}

export default LoginPage;
