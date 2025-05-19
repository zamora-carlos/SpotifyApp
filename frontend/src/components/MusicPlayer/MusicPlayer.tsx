import styles from './MusicPlayer.module.css';
import { BsShuffle } from 'react-icons/bs';
import { IoPlay, IoPause } from 'react-icons/io5';
import { AiOutlineStepBackward, AiOutlineStepForward } from 'react-icons/ai';
import { LuRepeat, LuRepeat1 } from 'react-icons/lu';
import { RiVolumeMuteFill, RiVolumeUpFill } from 'react-icons/ri';
import ProgressBar from '@components/ProgressBar';
import { useMusicPlayer } from '@context/MusicPlayerContext';
import formatTime from '@lib/formatTime';
import Tooltip from '@components/Tooltip';

function MusicPlayer() {
  const {
    currentTrack,
    togglePlay,
    skipNext,
    skipPrev,
    toggleShuffle,
    toggleRepeat,
    repeatMode,
    shuffle,
    position,
    duration,
    seek,
    volume,
    setPlayerVolume,
    isPaused,
  } = useMusicPlayer();

  const handleSeek = (value: number) => {
    seek(value * duration);
  };

  const handleVolumeChange = (value: number) => {
    setPlayerVolume(value);
  };

  return (
    <footer
      className={styles.player}
      aria-label={`Now playing: ${currentTrack?.name} by ${currentTrack?.artists?.[0]?.name}`}
    >
      <div className={`container ${styles.content}`}>
        <div className={styles.trackInfo}>
          {currentTrack?.album?.images?.[0]?.url && (
            <img
              src={currentTrack.album.images[0].url}
              alt={`Album cover of '${currentTrack.album.name}'`}
              className={styles.cover}
            />
          )}
          <div className={styles.trackDetails}>
            <p className={styles.songTitle}>
              {currentTrack?.name ?? 'No track playing'}
            </p>
            <p className={styles.artist}>
              {currentTrack?.artists?.[0]?.name ?? ''}
            </p>
            {currentTrack?.album?.name && (
              <p className={styles.playingFrom}>
                Playing from: {currentTrack.album.name}
              </p>
            )}
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.buttons}>
            <Tooltip
              tooltip="Shuffle"
              aria-label="Shuffle"
              onClick={toggleShuffle}
            >
              <BsShuffle
                className={styles.icon}
                color={shuffle ? '#e0fe40' : undefined}
              />
            </Tooltip>
            <Tooltip
              tooltip="Previous"
              aria-label="Previous track"
              onClick={skipPrev}
            >
              <AiOutlineStepBackward className={styles.icon} />
            </Tooltip>
            <Tooltip
              tooltip={isPaused ? 'Play' : 'Pause'}
              aria-label={isPaused ? 'Play' : 'Pause'}
              onClick={togglePlay}
            >
              <div className={styles.playIcon}>
                {isPaused ? <IoPlay /> : <IoPause />}
              </div>
            </Tooltip>
            <Tooltip tooltip="Next" aria-label="Next track" onClick={skipNext}>
              <AiOutlineStepForward className={styles.icon} />
            </Tooltip>
            <Tooltip
              tooltip="Repeat"
              aria-label="Repeat"
              onClick={toggleRepeat}
            >
              {repeatMode === 'track' ? (
                <LuRepeat1 className={styles.icon} color="#e0fe40" />
              ) : (
                <LuRepeat
                  className={styles.icon}
                  color={repeatMode !== 'off' ? '#e0fe40' : undefined}
                />
              )}
            </Tooltip>
          </div>
          <div className={styles.progress}>
            <span className={styles.time}>{formatTime(position)}</span>
            <ProgressBar
              value={duration ? position / duration : 0}
              max={1}
              ariaLabel="Playback"
              onChange={handleSeek}
              step={0.01}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.volumeContainer}>
          <div className={styles.volumeController}>
            <button className={styles.icon}>
              {volume === 0 ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
            </button>
            <div className={styles.volumeBar}>
              <ProgressBar
                value={volume}
                max={1}
                ariaLabel="Volume"
                onChange={handleVolumeChange}
                step={0.01}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MusicPlayer;
