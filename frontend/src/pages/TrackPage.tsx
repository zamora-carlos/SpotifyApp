import { useAuth } from '@context/AuthContext';
import { useApiRequest } from '@hooks/useApiRequest';
import { getTrackById } from '@lib/spotifyApi';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Track } from 'types/track.types';

type TrackWithLyrics = Track & {
  lyrics: string | null;
};

function TrackPage() {
  const { id } = useParams();
  const { getAccessToken } = useAuth();

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

      fetchTrackById(() => getTrackById(id, token));
    };

    test();
  }, [fetchTrackById, getAccessToken, id]);

  console.log(trackData?.lyrics);

  return (
    <div
      style={{ color: 'white', fontSize: '3rem', fontWeight: '700' }}
      className="container"
    >
      {trackStatus}
      <br />
      {trackData && trackData.name}
      <br />
      <pre
        style={{
          fontFamily: 'Poppins',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {trackData?.lyrics && trackData.lyrics}
      </pre>
    </div>
  );
}

export default TrackPage;
