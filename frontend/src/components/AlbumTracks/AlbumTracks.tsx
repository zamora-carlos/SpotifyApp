import type { SimplifiedTrack } from 'types/track.types';
import { RiHashtag } from 'react-icons/ri';
import { FaRegClock } from 'react-icons/fa6';
import styles from './AlbumTracks.module.css';
import formatTime from '@lib/formatTime';
import { Link } from 'react-router-dom';
import Tooltip from '@components/Tooltip';
import { IoPlay } from 'react-icons/io5';
import { useMusicPlayer } from '@context/MusicPlayerContext';

type AlbumTracksProps = {
  tracks: SimplifiedTrack[];
};

function AlbumTracks({ tracks }: AlbumTracksProps) {
  const { setUri } = useMusicPlayer();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Songs</h2>

      <div className={styles.table} role="table">
        <div className={styles.tableHeader} role="row">
          <div role="columnheader" aria-label="Index">
            <RiHashtag className={styles.icon} />
          </div>
          <div role="columnheader">Title</div>
          <div role="columnheader" aria-label="Duration">
            <FaRegClock className={styles.icon} />
          </div>
        </div>

        <div>
          {tracks.map((song, idx) => (
            <div key={song.id} className={styles.tableRow} role="row">
              <div role="cell" className={styles.columnIcon}>
                <span className={styles.songNumber}>{idx + 1}</span>
                <div className={styles.playButton}>
                  <Tooltip
                    tooltip="Play"
                    aria-label="Play"
                    onClick={() => setUri(`spotify:track:${song.id}`)}
                  >
                    <div className={styles.playIcon}>
                      <IoPlay />
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div role="cell">
                <Link to={`/track/${song.id}`} className={styles.trackLink}>
                  {song.name}
                </Link>
                {song.explicit && <span className={styles.explicit}>E</span>}
              </div>
              <div role="cell" className={styles.columnIcon}>
                {formatTime(song.duration_ms)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlbumTracks;
