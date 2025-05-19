import GoBackButton from '@components/GoBackButton';
import MusicPlayer from '@components/MusicPlayer';
import Spinner from '@components/Spinner';
import TrackHeader from '@components/TrackHeader';
import { useAuth } from '@context/AuthContext';
import { useApiRequest } from '@hooks/useApiRequest';
import { getTrackById } from '@lib/spotifyApi';
import { useEffect } from 'react';
import { MdLogout } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import type { Track } from 'types/track.types';
import { useNavigate } from 'react-router-dom';

type TrackWithLyrics = Track & {
  lyrics: string | null;
};

function TrackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken, logout } = useAuth();

  const {
    data: trackData,
    status: trackStatus,
    request: fetchTrackById,
  } = useApiRequest<TrackWithLyrics>();

  useEffect(() => {
    const test = async () => {
      const token = await getAccessToken();

      if (!id || !token) {
        return;
      }

      fetchTrackById(() => getTrackById(id, token, true));
    };

    test();
  }, [fetchTrackById, getAccessToken, id]);

  return (
    <>
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
        {trackStatus === 'loading' ? (
          <Spinner />
        ) : trackData !== null ? (
          <>
            <TrackHeader track={trackData} />

            {trackData.lyrics && (
              <>
                <h2 className="h2Title" style={{ marginTop: '3rem' }}>
                  Lyrics
                </h2>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontFamily: 'Poppins',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: 'var(--clr-purple-light)',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                  }}
                >
                  {trackData?.lyrics && trackData.lyrics}
                </pre>
              </>
            )}
          </>
        ) : (
          <p>Error while fetching album data</p>
        )}
      </section>
      <MusicPlayer />
    </>
  );
}

export default TrackPage;
