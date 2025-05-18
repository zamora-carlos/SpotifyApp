import React, { useEffect, useState, useCallback } from 'react';
import useSpotifyPlayer from '@hooks/useSpotifyPlayer';
import { useAuth } from '@context/AuthContext';

type RepeatMode = 'off' | 'context' | 'track';

type PlayBody = { uris: string[] } | { context_uri: string };

function PlayerControls() {
  const [token, setToken] = useState<string | null>(null);
  const [uri, setUri] = useState<string | string[]>('');
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const { getAccessToken } = useAuth();
  const { player, deviceId } = useSpotifyPlayer(token);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessToken();
      setToken(t);
    };
    fetchToken();
  }, [getAccessToken]);

  useEffect(() => {
    if (!player) return;

    const onStateChange = (state: Spotify.PlaybackState | null) => {
      if (!state) return;
      if (!seeking) {
        setPosition(state.position ?? 0);
      }
      setDuration(state.duration ?? 0);
    };

    player.addListener('player_state_changed', onStateChange);

    return () => {
      player.removeListener('player_state_changed', onStateChange);
    };
  }, [player, seeking]);

  const playUri = useCallback(async () => {
    if (!token || !deviceId || !uri) return;

    let body: PlayBody;

    if (typeof uri === 'string') {
      const isTrack = uri.startsWith('spotify:track:');
      body = isTrack ? { uris: [uri] } : { context_uri: uri };
    } else if (Array.isArray(uri) && uri.length > 0) {
      body = { uris: uri };
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

      console.log(
        `Playing ${Array.isArray(uri) ? `${uri.length} tracks` : uri}`
      );
    } catch (error) {
      console.error('Failed to play URI:', error);
    }
  }, [token, deviceId, uri]);

  useEffect(() => {
    if (uri) {
      playUri();
    }
  }, [uri, playUri]);

  const toggleShuffle = async () => {
    if (!token || !deviceId) return;

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}&device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShuffle(prev => !prev);
    } catch (error) {
      console.error('Failed to toggle shuffle:', error);
    }
  };

  const toggleRepeat = async () => {
    if (!token || !deviceId) return;

    // Cycle: off -> context -> track -> off
    const nextRepeatMode: RepeatMode =
      repeatMode === 'off'
        ? 'context'
        : repeatMode === 'context'
          ? 'track'
          : 'off';

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${nextRepeatMode}&device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRepeatMode(nextRepeatMode);
      console.log(`Repeat mode set to ${nextRepeatMode}`);
    } catch (error) {
      console.error('Failed to set repeat mode:', error);
    }
  };

  const togglePlay = async () => {
    if (!player) return;
    const state = await player.getCurrentState();
    if (state?.paused) {
      await player.resume();
    } else {
      await player.pause();
    }
  };

  const skipNext = async () => {
    await player?.nextTrack();
    playUri();
  };

  const skipPrev = async () => {
    await player?.previousTrack();
    playUri();
  };

  const seek = async (positionMs: number) => {
    await player?.seek(positionMs);
    setPosition(positionMs);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUriChange = (value: string) => {
    if (value.includes(',')) {
      const arr = value
        .split(',')
        .map(u => u.trim())
        .filter(u => u.length > 0);
      setUri(arr);
    } else {
      setUri(value.trim());
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 400 }}>
      <h2>Spotify Player</h2>

      <input
        type="text"
        value={typeof uri === 'string' ? uri : uri.join(', ')}
        onChange={e => handleUriChange(e.target.value)}
        placeholder="Enter Spotify URI(s), comma separated"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <button onClick={togglePlay}>Pause/Resume</button>
      <button onClick={skipPrev}>⏮️ Prev</button>
      <button onClick={skipNext}>⏭️ Next</button>
      <button onClick={toggleShuffle}>
        Shuffle: {shuffle ? 'On 🔀' : 'Off'}
      </button>
      <button onClick={toggleRepeat}>
        Repeat:{' '}
        {repeatMode === 'off'
          ? 'Off'
          : repeatMode === 'context'
            ? 'All 🔁'
            : 'One 🔂'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="seek">Seek: </label>
        <input
          type="range"
          id="seek"
          min={0}
          max={duration}
          value={position}
          onChange={e => {
            setSeeking(true);
            setPosition(Number(e.target.value));
          }}
          onMouseUp={e => {
            setSeeking(false);
            seek(Number((e.target as HTMLInputElement).value));
          }}
          onTouchEnd={e => {
            setSeeking(false);
            seek(Number((e.target as HTMLInputElement).value));
          }}
          style={{ width: '100%' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
          }}
        >
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerControls;
