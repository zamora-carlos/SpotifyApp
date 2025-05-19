import GoBackButton from '@components/GoBackButton';
import { useParams } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useApiRequest } from '@hooks/useApiRequest';
import { getAlbumById } from '@lib/spotifyApi';
import Spinner from '@components/Spinner';
import { useEffect } from 'react';
import type { Album } from 'types/album.types';
import AlbumHeader from '@components/AlbumHeader';
import AlbumTracks from '@components/AlbumTracks';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken, logout } = useAuth();

  const {
    data: albumData,
    status: albumRequestStatus,
    request: fetchAlbumData,
  } = useApiRequest<Album>();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();

      if (!id || !token) {
        return;
      }

      fetchAlbumData(() => getAlbumById(id, token));
    };

    fetchData();
  }, [fetchAlbumData, getAccessToken, id]);

  return (
    <section className="container" style={{ marginBottom: '6rem' }}>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <GoBackButton />

        <div className="logoutContainer">
          <button
            className="logout"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
            <MdLogout />
          </button>
        </div>
      </div>
      {albumRequestStatus === 'loading' ? (
        <Spinner />
      ) : albumData !== null ? (
        <>
          <AlbumHeader album={albumData} />
          <AlbumTracks tracks={albumData.tracks.items} />
        </>
      ) : (
        <p>Error while fetching album data</p>
      )}
    </section>
  );
}

export default AlbumPage;
