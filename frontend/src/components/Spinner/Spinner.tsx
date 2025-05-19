import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
    </div>
  );
}

export default Spinner;
