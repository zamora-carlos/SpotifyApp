import { useNavigate } from 'react-router-dom';
import { IoChevronDownSharp } from 'react-icons/io5';
import styles from './GoBackButton.module.css';

function GoBackButton() {
  const navigate = useNavigate();

  return (
    <button className={styles.button} onClick={() => navigate(-1)}>
      <IoChevronDownSharp className={styles.icon} />
      Go back
    </button>
  );
}

export default GoBackButton;
