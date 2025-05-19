import Genres from '@components/Genres';
import styles from './ArtistHeader.module.css';
import type { Artist } from 'types/artist.types';
import notImageAvailable from '@assets/images/no-image-available.png';

type ArtistHeaderProps = {
  artist: Artist;
};

function ArtistHeader({ artist }: ArtistHeaderProps) {
  return (
    <section className={styles.container}>
      <img
        src={artist?.images?.[0]?.url || notImageAvailable}
        alt={artist.name}
        className={styles.image}
      />

      <div className={styles.details}>
        <h1 className={styles.name}>{artist.name}</h1>
        <div className={styles.info}>
          <div>
            <p>Followers</p>
            <h2>{artist.followers.total.toLocaleString()}</h2>
          </div>
          <div>
            <p>Popularity</p>
            <h2>{artist.popularity}/100</h2>
          </div>
        </div>
        <div className={styles.genres}>
          {artist?.genres && artist.genres.length > 0 ? (
            <>
              <p>Genres</p>
              <Genres
                tags={artist.genres
                  .slice(0, 4)
                  .map(genre => genre[0].toUpperCase() + genre.slice(1))}
              />
            </>
          ) : (
            <p>No genres available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArtistHeader;
