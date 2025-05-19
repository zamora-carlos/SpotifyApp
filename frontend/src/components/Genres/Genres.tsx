import styles from './Genres.module.css';

type GenresProps = {
  tags: string[];
};

function Genres({ tags }: GenresProps) {
  return (
    <div className={styles.container}>
      {tags.map(tag => (
        <span key={tag} className={styles.tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export default Genres;
