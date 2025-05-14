import React from 'react';
import styles from './SearchInput.module.css';

type SearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id: string;
};

function SearchInput({ value, onChange, placeholder, id }: SearchInputProps) {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className={styles.input}
        placeholder={placeholder}
      />
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
    </div>
  );
}

export default SearchInput;
