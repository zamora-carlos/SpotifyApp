import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

function Button({
  onClick,
  children,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      tabIndex={0}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
