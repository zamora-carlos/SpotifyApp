import GoBackButton from '@components/GoBackButton';
import ArtistHeader from '@components/ArtistHeader';
import SongsTable from '@components/SongsTable';
import MusicPlayer from '@components/MusicPlayer';
import { useParams } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import type { Artist } from 'types/artist.types';
import { useApiRequest } from '@hooks/useApiRequest';
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
} from '@lib/spotifyApi';
import Spinner from '@components/Spinner';
import { useEffect } from 'react';
import type { Track } from 'types/track.types';
import Card from '@components/Card';
import notImageAvailable from '@assets/images/no-image-available.png';
import type { SimplifiedAlbum } from 'types/album.types';
import type { PaginatedResponse } from 'types/paginatedResponse.types';

function ArtistPage() {
  const { id } = useParams();
  const { getAccessToken } = useAuth();

  const {
    data: artistData,
    status: artistRequestStatus,
    request: fetchArtistData,
  } = useApiRequest<Artist>();

  const {
    data: artistTracksData,
    status: artistTracksRequestStatus,
    request: fetchArtistTracksData,
  } = useApiRequest<{ tracks: Track[] }>();

  const {
    data: artistAlbumsData,
    status: artistsAlbumsRequestStatus,
    request: fetchArtistAlbumsData,
  } = useApiRequest<PaginatedResponse<SimplifiedAlbum>>();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();

      if (!id || !token) {
        return;
      }

      fetchArtistData(() => getArtistById(id, token));
      fetchArtistTracksData(() => getArtistTopTracks(id, token));
      fetchArtistAlbumsData(() => getArtistAlbums(id, token, 1));
    };

    fetchData();
  }, [
    fetchArtistData,
    fetchArtistTracksData,
    fetchArtistAlbumsData,
    getAccessToken,
    id,
  ]);

  return (
    <>
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ marginTop: '2rem' }}>
          <GoBackButton />
        </div>
        {artistRequestStatus === 'loading' ? (
          <Spinner />
        ) : artistData !== null ? (
          <ArtistHeader artist={artistData} />
        ) : (
          <p>Error while fetching artist data</p>
        )}

        {artistTracksRequestStatus === 'loading' ? (
          <Spinner />
        ) : artistTracksData !== null ? (
          <SongsTable songs={artistTracksData.tracks} />
        ) : (
          <p>Error while fetching artist's top tracks</p>
        )}

        {artistsAlbumsRequestStatus === 'loading' ? (
          <Spinner />
        ) : artistAlbumsData !== null ? (
          <>
            <h2 className="h2Title" style={{ marginTop: '3rem' }}>
              Albums
            </h2>
            <div className="grid">
              {artistAlbumsData.items.map(album => (
                <Card
                  key={album.id}
                  title={album.name}
                  subtitle={`${new Date(album.release_date).getUTCFullYear()} - ${album.total_tracks} tracks`}
                  imageUrl={album.images?.[0]?.url || notImageAvailable}
                  alt={`Album ${album.name}`}
                  link={`/album/${album.id}`}
                />
              ))}
            </div>
          </>
        ) : (
          <p>Error while fetching artist's albums</p>
        )}
      </section>

      <MusicPlayer />
    </>
  );
}

export default ArtistPage;
