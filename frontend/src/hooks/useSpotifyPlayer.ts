import { useEffect, useState } from 'react';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

function useSpotifyPlayer(token: string | null) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    if (!document.getElementById('spotify-sdk')) {
      const script = document.createElement('script');
      script.id = 'spotify-sdk';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      newPlayer.connect().then(success => {
        if (success) {
          console.log(
            'The Web Playback SDK successfully connected to Spotify!'
          );

          newPlayer.getCurrentState().then(state => {
            if (!state) {
              console.warn(
                'Player is not in a state yet. Make sure the tab is active and the token is valid.'
              );
            }
          });
        } else {
          console.error('Failed to connect to Spotify Web Playback SDK');
        }
      });

      setPlayer(newPlayer);
    };

    return () => {
      player?.disconnect();
    };
  }, [token, player]);

  return { player, deviceId, ready: !!player && !!deviceId };
}

export default useSpotifyPlayer;
