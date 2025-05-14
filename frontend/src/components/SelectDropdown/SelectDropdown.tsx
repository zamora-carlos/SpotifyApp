import React from 'react';
import styles from './SelectDropdown.module.css';

type SelectDropdownProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  id: string;
};

function SelectDropdown({ value, onChange, options, id }: SelectDropdownProps) {
  return (
    <div className={styles.selectWrapper}>
      <label htmlFor={id} className="sr-only">
        Category
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectDropdown;
