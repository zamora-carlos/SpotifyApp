import Spinner from '@components/Spinner';
import useSpotifyAuth from '@hooks/useSpotifyAuth';

function CallbackPage() {
  useSpotifyAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />;
    </div>
  );
}

export default CallbackPage;
