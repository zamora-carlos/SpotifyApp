import styles from './GoBackButton.module.css';

function GoBackButton() {
  return (
    <button className={styles.button}>
      <span className={styles.icon}>←</span> Go back
    </button>
  );
}

export default GoBackButton;
