import React from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  step: number;
};

function ProgressBar({
  value,
  max,
  onChange,
  ariaLabel,
  step,
}: ProgressBarProps) {
  const percent = Math.floor((value / max) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    onChange(Number(e.target.value));
  };

  return (
    <div className={styles.progressContainer}>
      <input
        type="range"
        min={0}
        step={step}
        max={max}
        value={value}
        onChange={handleChange}
        className={styles.input}
        aria-label={ariaLabel}
      />
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
        <div
          className={styles.thumb}
          style={{ left: `${percent}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export default ProgressBar;
