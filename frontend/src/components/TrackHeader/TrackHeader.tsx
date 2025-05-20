import styles from './TrackHeader.module.css';
import notImageAvailable from '@assets/images/no-image-available.png';
import Tooltip from '@components/Tooltip';
import { useMusicPlayer } from '@context/MusicPlayerContext';
import formatTime from '@lib/formatTime';
import { IoPlay } from 'react-icons/io5';
import type { Track } from 'types/track.types';

type TrackHeaderProps = {
  track: Track;
};

function TrackHeader({ track }: TrackHeaderProps) {
  const { play } = useMusicPlayer();

  return (
    <section className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={track?.album?.images?.[0]?.url || notImageAvailable}
          alt={track.name}
          className={styles.image}
        />

        <div className={styles.tooltipContainer}>
          <Tooltip
            tooltip="Play"
            aria-label="Play track"
            onClick={() => play(`spotify:track:${track.id}`)}
            distance="90%"
          >
            <div className={styles.playIcon}>
              <IoPlay />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className={styles.details}>
        {track?.artists.length > 0 && <span>{track.artists[0].name}</span>}
        <h1 className={styles.name}>{track.name}</h1>
        <div className={styles.info}>
          <div>
            <p>Release year</p>
            <h2>{new Date(track.album.release_date).getUTCFullYear()}</h2>
          </div>
          <div>
            <p>Popularity</p>
            <h2>{track.popularity}/100</h2>
          </div>
          <div>
            <p>Duration</p>
            <h2>{formatTime(track.duration_ms)}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackHeader;
