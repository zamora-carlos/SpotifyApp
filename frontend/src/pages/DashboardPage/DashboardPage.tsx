import { useState, useEffect } from 'react';
import SearchInput from '@components/SearchInput';
import SelectDropdown from '@components/SelectDropdown';
import Button from '@components/Button';
import Card from '@components/Card';
import { useAuth } from '@context/AuthContext';
import { getTopArtists, search } from '@lib/spotifyApi';
import {
  SEARCH_TYPES,
  type SearchType,
  type SearchResponse,
} from '../../types/search.types';
import type { Artist } from 'types/artist.types';
import styles from './DashboardPage.module.css';
import notImageAvailable from '@assets/images/no-image-available.png';
import { useApiRequest } from '@hooks/useApiRequest';

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<SearchType>('artist');

  const { getAccessToken } = useAuth();

  const {
    data: topArtistsData,
    status: topArtistsStatus,
    request: fetchTopArtists,
  } = useApiRequest<{ items: Artist[] }>();

  const {
    data: searchResults,
    status: searchStatus,
    request: runSearch,
  } = useApiRequest<SearchResponse>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await getAccessToken();
    if (!token || !searchTerm.trim()) return;

    runSearch(() => search(searchTerm, category, 1, token));
  };

  useEffect(() => {
    const fetch = async () => {
      const token = await getAccessToken();
      if (token) {
        fetchTopArtists(() => getTopArtists(token, 1));
      }
    };
    fetch();
  }, [getAccessToken, fetchTopArtists]);

  return (
    <main className="container" style={{ marginBottom: '6rem' }}>
      <h1 className="sr-only">Dashboard</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <SearchInput
          id="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onCancel={() => setSearchTerm('')}
          placeholder="What are you looking for?"
        />
        <div className={styles.formRow}>
          <SelectDropdown
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value as SearchType)}
            options={SEARCH_TYPES}
          />
          <Button type="submit">
            {searchStatus === 'loading' ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My top artists —</h2>

        {topArtistsStatus === 'loading' && <p>Loading top artists...</p>}

        <div className={styles.grid}>
          {topArtistsData?.items.map(artist => (
            <Card
              key={artist.id}
              title={artist.name}
              alt={`Artist ${artist.name}`}
              subtitle={
                artist.genres
                  ?.map(g => g[0].toUpperCase() + g.slice(1))
                  .slice(0, 3)
                  .join(', ') || '---'
              }
              imageUrl={artist.images?.[0]?.url || notImageAvailable}
              link={`/artist/${artist.id}`}
            />
          ))}
        </div>
      </section>

      {searchResults && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Search results —</h2>
          <div className={styles.grid}>
            {searchResults.type === 'artist' &&
              searchResults.data.items.map(artist => (
                <Card
                  key={artist.id}
                  title={artist.name}
                  subtitle={
                    artist.genres
                      ?.map(genre => genre[0].toUpperCase() + genre.slice(1))
                      .slice(0, 3)
                      .join(', ') || '---'
                  }
                  imageUrl={artist.images?.[0]?.url || notImageAvailable}
                  alt={`Artist ${artist.name}`}
                  link={`/artist/${artist.id}`}
                />
              ))}

            {searchResults.type === 'album' &&
              searchResults.data.items.map(album => (
                <Card
                  key={album.id}
                  title={album.name}
                  subtitle={`${new Date(album.release_date).getUTCFullYear()} - ${album.total_tracks} tracks`}
                  imageUrl={album.images?.[0]?.url || notImageAvailable}
                  alt={`Album ${album.name}`}
                  link={`/album/${album.id}`}
                />
              ))}

            {searchResults.type === 'track' &&
              searchResults.data.items.map(track => (
                <Card
                  key={track.id}
                  title={track.name}
                  subtitle={
                    track.artists?.map(a => a.name).join(', ') ||
                    'Unknown Artist'
                  }
                  imageUrl={track.album?.images?.[0]?.url || notImageAvailable}
                  alt={`Track ${track.name}`}
                  link={`/track/${track.id}`}
                />
              ))}

            {searchResults.type === 'playlist' &&
              searchResults.data.items
                .filter(playlist => playlist !== null)
                .map(playlist => (
                  <Card
                    key={playlist.id}
                    title={playlist.name}
                    subtitle={`${playlist.tracks.total} tracks`}
                    imageUrl={playlist.images?.[0]?.url || notImageAvailable}
                    alt={`Playlist ${playlist.name}`}
                    link={`/playlist/${playlist.id}`}
                  />
                ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
