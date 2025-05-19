import type { ReactNode, CSSProperties } from 'react';
import styles from './Tooltip.module.css';

type TooltipProps = {
  tooltip: string;
  children: ReactNode;
  as?: 'button' | 'div';
  position?: 'bottom' | 'top' | 'left' | 'right';
  distance?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function Tooltip({
  tooltip,
  children,
  as = 'button',
  position = 'bottom',
  distance = '125%',
  onClick,
  ariaLabel,
}: TooltipProps) {
  const Component = as;

  const customStyle: CSSProperties = {
    ['--tooltip-distance' as string]: distance,
  };

  return (
    <Component
      className={`${styles.container} ${styles[`tooltip-${position}`]}`}
      data-tooltip={tooltip}
      aria-label={ariaLabel || tooltip}
      onClick={onClick}
      style={customStyle}
      type="reset"
    >
      {children}
    </Component>
  );
}
