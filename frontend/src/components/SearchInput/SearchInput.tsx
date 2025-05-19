import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineClear } from 'react-icons/md';
import styles from './SearchInput.module.css';
import Tooltip from '@components/Tooltip';

type SearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
  id: string;
};

function SearchInput({
  value,
  onChange,
  onCancel,
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
      <div className={styles.searchIconContainer}>
        <Tooltip
          tooltip="Search"
          as="div"
          ariaLabel="Search by any category"
          distance="110%"
        >
          <BiSearch className={styles.searchIcon} />
        </Tooltip>
      </div>
      <div className={styles.cancelIconContainer}>
        <Tooltip
          tooltip="Clear"
          onClick={onCancel}
          ariaLabel="Clear search"
          distance="110%"
        >
          <MdOutlineClear className={styles.cancelIcon} />
        </Tooltip>
      </div>
    </div>
  );
}

export default SearchInput;
