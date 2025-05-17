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
import NotImageAvailable from '@assets/images/no-image-available.png';
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

  console.log(searchResults);

  return (
    <main className="container">
      <h1 className="sr-only">Dashboard</h1>

      {/* Search Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <SearchInput
          id="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
              imageUrl={artist.images?.[0]?.url || NotImageAvailable}
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
                  imageUrl={artist.images?.[0]?.url || NotImageAvailable}
                  alt={`Artist ${artist.name}`}
                  link={`/artist/${artist.id}`}
                />
              ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
