import useSpotifyAuth from '@hooks/useSpotifyAuth';

function CallbackPage() {
  useSpotifyAuth();
  return <div>Spinning like a topping</div>;
}

export default CallbackPage;
