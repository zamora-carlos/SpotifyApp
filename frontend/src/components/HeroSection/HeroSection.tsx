import Button from '@components/Button';
import HeroDoodle from '@components/HeroDoodle';
import heroImg from '@assets/images/hero-img.png';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  authError: string;
};

function HeroSection({ authError }: HeroSectionProps) {
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes =
      'streaming user-read-email user-read-private user-top-read user-modify-playback-state';

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      show_dialog: 'true',
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    window.location.href = authUrl;
  };

  return (
    <main className="container">
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            Find your favorite artists
          </h1>
          <p className={styles.text}>
            See your top artists, explore albums, dive into playlists, read
            lyrics, and play your favorite tracks—all in one place.
          </p>
          <p className={styles.text}>
            Connect your Spotify account to unlock a personalized music
            experience.
          </p>
          <Button onClick={handleLogin} className={styles.button}>
            Login
          </Button>

          {authError && <p className={styles.text}>{authError}</p>}
        </div>

        <div className={styles.imageContainer} aria-hidden="true">
          <div className={styles.imageBackground}>
            <img src={heroImg} alt="" className={styles.image} />
          </div>
          <HeroDoodle className={styles.decoration} />
        </div>
      </section>
    </main>
  );
}

export default HeroSection;
