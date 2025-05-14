import styles from './MusicPlayer.module.css';
import {
  FaPlay,
  FaStepForward,
  FaStepBackward,
  FaRedo,
  FaRandom,
} from 'react-icons/fa';

function MusicPlayer() {
  return (
    <footer
      className={styles.player}
      aria-label="Now playing: All I Ever Am by The Cure"
    >
      {/* Left Section */}
      <div className={styles.trackInfo}>
        <img
          src="https://mundoindie.mx/wp-content/uploads/2025/04/Laufey-MEXICO.png"
          alt="Album cover of 'Songs of a Lost World'"
          className={styles.cover}
        />
        <div>
          <p className={styles.songTitle}>All I Ever Am</p>
          <p className={styles.artist}>The Cure</p>
          <p className={styles.playingFrom}>
            Playing from: Songs of a Lost World
          </p>
        </div>
      </div>

      {/* Center Controls */}
      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button aria-label="Shuffle" className={styles.iconButton}>
            <FaRandom />
          </button>
          <button aria-label="Previous track" className={styles.iconButton}>
            <FaStepBackward />
          </button>
          <button aria-label="Play" className={styles.playButton}>
            <FaPlay />
          </button>
          <button aria-label="Next track" className={styles.iconButton}>
            <FaStepForward />
          </button>
          <button aria-label="Repeat" className={styles.iconButton}>
            <FaRedo />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={styles.progress}>
          <span className={styles.time}>2:33</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <span className={styles.time}>5:21</span>
        </div>
      </div>

      {/* Right Section (optional buttons) */}
      <div className={styles.extraButtons}>
        <button aria-label="Like track" className={styles.iconButton}>
          ♡
        </button>
        <button aria-label="More options" className={styles.iconButton}>
          ⋯
        </button>
      </div>
    </footer>
  );
}

export default MusicPlayer;
