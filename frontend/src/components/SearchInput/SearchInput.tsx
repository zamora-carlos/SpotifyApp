import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineClear } from 'react-icons/md';
import styles from './SearchInput.module.css';

type SearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id: string;
};

function SearchInput({
  value,
  onChange,
  placeholder,
  id,
  className = '',
}: SearchInputProps) {
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
        className={`${styles.input} ${className}`}
        placeholder={placeholder}
      />
      <BiSearch className={styles.searchIcon} />
      <MdOutlineClear className={styles.cancelIcon} />
    </div>
  );
}

export default SearchInput;
