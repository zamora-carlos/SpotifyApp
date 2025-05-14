import Genres from '@components/Genres';
import styles from './ArtistHeader.module.css';

type ArtistHeaderProps = {
  name: string;
  imageUrl: string;
  followers: number;
  popularity: number;
  genres: string[];
};

function ArtistHeader({
  name,
  imageUrl,
  followers,
  popularity,
  genres,
}: ArtistHeaderProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{name}</h1>
      <img src={imageUrl} alt={name} className={styles.image} />
      <div className={styles.info}>
        <div>
          <p>Followers</p>
          <h2>{followers.toLocaleString()}</h2>
        </div>
        <div>
          <p>Popularity</p>
          <h2>{popularity}/100</h2>
        </div>
      </div>
      <div className={styles.genres}>
        <p>Genres</p>
        <Genres tags={genres} />
      </div>
    </div>
  );
}

export default ArtistHeader;
