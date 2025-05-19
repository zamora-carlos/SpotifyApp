import GoBackButton from '@components/GoBackButton';
import ArtistHeader from '@components/ArtistHeader';
import PopularSongsTable from '@components/PopularSongsTable';
import MusicPlayer from '@components/MusicPlayer';

const artist = {
  name: 'Laufey',
  imageUrl:
    'https://mundoindie.mx/wp-content/uploads/2025/04/Laufey-MEXICO.png',
  followers: 123263,
  popularity: 75,
  genres: ['Jazz', 'Pop', 'Bosa nova', 'Classica'],
  songs: [
    { name: 'The Beautiful People', timesPlayed: 408371204, length: '3:38' },
    {
      name: 'Sweet Dreams (Are made of this)',
      timesPlayed: 403371204,
      length: '4:53',
    },
    { name: 'Tainted Love', timesPlayed: 184103987, length: '3:20' },
  ],
};

function ArtistPage() {
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <GoBackButton />
        <ArtistHeader {...artist} />
        <PopularSongsTable songs={artist.songs} />
      </div>
      <MusicPlayer />
    </>
  );
}

export default ArtistPage;
