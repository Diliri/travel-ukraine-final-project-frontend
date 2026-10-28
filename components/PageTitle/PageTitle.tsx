import { ReactNode } from 'react';
import styles from './PageTitle.module.css';

interface PageTitleProps {
  children: ReactNode;
  variant?: 'title' | 'traveller' | 'modal';
  align?: 'left' | 'center' | 'right';
  color?: 'scheme1' | 'scheme2';
  marginBottom?: number;
  className?: string;
}

export const PageTitle = ({
  children,
  variant = 'title',
  align = 'left',
  color = 'scheme2',
  marginBottom = 0,
  className = '',
}: PageTitleProps) => {
  const colorStyles = {
    scheme1: styles.colorScheme1,
    scheme2: styles.colorScheme2,
  };

  const combinedClasses = [
    styles.base,
    styles[variant],
    styles[align],
    colorStyles[color],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <h1
      className={combinedClasses}
      style={{ marginBottom: `${marginBottom}px` }}
    >
      {children}
    </h1>
  );
};