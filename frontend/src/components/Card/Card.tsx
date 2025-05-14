import styles from './Card.module.css';

type CardProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
  alt?: string;
  link: string;
};

function Card({
  title,
  subtitle,
  imageUrl,
  alt = 'Card image',
  link,
}: CardProps) {
  return (
    <a href={link} className={styles.card} aria-label={`Go to ${title}`}>
      {imageUrl && <img src={imageUrl} alt={alt} className={styles.image} />}
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </a>
  );
}

export default Card;
