import styles from './HeroSection.module.css';
import Button from '@components/Button';
import heroImg from '@assets/images/hero-img.png';

function HeroSection() {
  const handleLogin = () => {
    console.log('Login clicked');
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          Find your favorite artists
        </h1>
        <p className={styles.text}>
          See your top artists, explore albums, dive into playlists, read
          lyrics, and play your favorite tracks—all in one place.
        </p>
        <p className={styles.subtext}>
          Connect your Spotify account to unlock a personalized music
          experience.
        </p>
        <Button onClick={handleLogin}>Login</Button>
      </div>
      <div className={styles.imageContainer} aria-hidden="true">
        <div className={styles.imageBackground}>
          <img src={heroImg} alt="" className={styles.image} />
          <span className={styles.decoration}></span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
