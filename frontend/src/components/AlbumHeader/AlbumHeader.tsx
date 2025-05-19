import styles from './AlbumHeader.module.css';
import notImageAvailable from '@assets/images/no-image-available.png';
import Tooltip from '@components/Tooltip';
import { useMusicPlayer } from '@context/MusicPlayerContext';
import { IoPlay } from 'react-icons/io5';
import type { Album } from 'types/album.types';

type AlbumHeaderProps = {
  album: Album;
};

function AlbumHeader({ album }: AlbumHeaderProps) {
  const { setUri } = useMusicPlayer();

  return (
    <section className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={album?.images?.[0]?.url || notImageAvailable}
          alt={album.name}
          className={styles.image}
        />

        <div className={styles.tooltipContainer}>
          <Tooltip
            tooltip="Play album"
            aria-label="Play album"
            onClick={() => setUri(`spotify:album:${album.id}`)}
            distance="90%"
          >
            <div className={styles.playIcon}>
              <IoPlay />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className={styles.details}>
        <h1 className={styles.name}>{album.name}</h1>
        <div className={styles.info}>
          <div>
            <p>Release year</p>
            <h2>{new Date(album.release_date).getUTCFullYear()}</h2>
          </div>
          <div>
            <p>Popularity</p>
            <h2>{album.popularity}/100</h2>
          </div>
          <div>
            <p>Total tracks</p>
            <h2>{album.total_tracks}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlbumHeader;
