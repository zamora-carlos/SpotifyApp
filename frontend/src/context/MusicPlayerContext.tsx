import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@context/AuthContext';
import useSpotifyPlayer from '@hooks/useSpotifyPlayer';

type RepeatMode = 'off' | 'context' | 'track';
type PlayBody = { uris: string[] } | { context_uri: string };

type MusicPlayerContextValue = {
  currentTrack: Spotify.Track | null;
  shuffle: boolean;
  repeatMode: RepeatMode;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seek: (ms: number) => void;
  position: number;
  duration: number;
  isPaused: boolean;
  play: (newUri: string | string[]) => void;
  setSeeking: (s: boolean) => void;
  volume: number;
  setPlayerVolume: (v: number) => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | undefined>(
  undefined
);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const [isPaused, setIsPaused] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  const { getAccessToken } = useAuth();
  const { player, deviceId, ready } = useSpotifyPlayer(token);

  useEffect(() => {
    getAccessToken().then(setToken);
  }, [getAccessToken]);

  useEffect(() => {
    if (!player) return;

    const onStateChange = (state: Spotify.PlaybackState | null) => {
      if (!state) return;
      if (!seeking) setPosition(state.position ?? 0);
      setDuration(state.duration ?? 0);
      setCurrentTrack(state.track_window.current_track);
      setIsPaused(state.paused);
    };

    player.addListener('player_state_changed', onStateChange);

    return () => {
      player.removeListener('player_state_changed', onStateChange);
    };
  }, [player, seeking]);

  useEffect(() => {
    if (!player || isPaused || seeking) return;

    const interval = setInterval(async () => {
      const state = await player.getCurrentState();
      if (state && !seeking) {
        setPosition(state.position);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPaused, seeking]);

  const playUri = useCallback(
    async (inputUri: string | string[]) => {
      if (!token || !deviceId || !inputUri || !ready) return;

      let body: PlayBody;

      if (typeof inputUri === 'string') {
        const isTrack = inputUri.startsWith('spotify:track:');
        body = isTrack ? { uris: [inputUri] } : { context_uri: inputUri };
      } else if (Array.isArray(inputUri) && inputUri.length > 0) {
        body = { uris: inputUri };
      } else {
        return;
      }

      try {
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );
      } catch (err) {
        console.error('Play failed:', err);
      }
    },
    [token, deviceId]
  );

  const togglePlay = async () => {
    if (!player) return;
    const state = await player.getCurrentState();

    if (state?.paused) {
      await player.resume();
    } else {
      await player.pause();
    }
  };

  const toggleShuffle = async () => {
    if (!token || !deviceId) return;
    const newState = !shuffle;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newState}&device_id=${deviceId}`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
      );
      setShuffle(newState);
    } catch (err) {
      console.error('Shuffle error:', err);
    }
  };

  const toggleRepeat = async () => {
    if (!token || !deviceId) return;
    const next: RepeatMode =
      repeatMode === 'off'
        ? 'context'
        : repeatMode === 'context'
          ? 'track'
          : 'off';

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${next}&device_id=${deviceId}`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
      );
      setRepeatMode(next);
    } catch (err) {
      console.error('Repeat error:', err);
    }
  };

  const play = (newUri: string | string[]) => {
    if (!ready) return;
    playUri(newUri);
  };

  const skipNext = async () => {
    await player?.nextTrack();
  };

  const skipPrev = async () => {
    await player?.previousTrack();
  };

  const seek = async (ms: number) => {
    await player?.seek(ms);
    setPosition(ms);
  };

  const setPlayerVolume = async (value: number) => {
    if (!player) return;
    await player.setVolume(value);
    setVolume(value);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        shuffle,
        repeatMode,
        togglePlay,
        play,
        toggleShuffle,
        toggleRepeat,
        skipNext,
        skipPrev,
        seek,
        position,
        duration,
        setSeeking,
        volume,
        setPlayerVolume,
        isPaused,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }

  return context;
}
