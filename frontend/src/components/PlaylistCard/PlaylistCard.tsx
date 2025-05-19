import styles from './PlaylistCard.module.css';
import type { Playlist } from 'types/playlist.types';
import notImageAvailable from '@assets/images/no-image-available.png';
import Tooltip from '@components/Tooltip';
import { IoPlay } from 'react-icons/io5';
import { useMusicPlayer } from '@context/MusicPlayerContext';

type PlaylistCardProps = {
  playlist: Playlist;
};

function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { setUri } = useMusicPlayer();

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={playlist.images?.[0]?.url || notImageAvailable}
          alt={`Image for the playlist "${playlist.name}"`}
          className={styles.image}
        />

        <div className={styles.tooltipContainer}>
          <Tooltip
            tooltip="Play playlist"
            aria-label="Play playlist"
            onClick={() => setUri(`spotify:playlist:${playlist.id}`)}
            distance="90%"
          >
            <div className={styles.playIcon}>
              <IoPlay />
            </div>
          </Tooltip>
        </div>
      </div>
      <div>
        <h3 className={styles.title}>{playlist.name}</h3>
        <p className={styles.subtitle}>{`${playlist.tracks.total} tracks`}</p>
      </div>
    </div>
  );
}

export default PlaylistCard;
