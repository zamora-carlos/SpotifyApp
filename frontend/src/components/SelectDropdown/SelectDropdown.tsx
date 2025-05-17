import React from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import styles from './SelectDropdown.module.css';

type Option = {
  label: string;
  value: string;
};

type SelectDropdownProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  options: ReadonlyArray<Option>;
};

function SelectDropdown({
  value,
  onChange,
  options,
  id,
  className = '',
}: SelectDropdownProps) {
  return (
    <div className={styles.selectWrapper}>
      <label htmlFor={id} className="sr-only">
        Category
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${styles.select} ${className}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <IoChevronDownSharp className={styles.icon} />
    </div>
  );
}

export default SelectDropdown;
