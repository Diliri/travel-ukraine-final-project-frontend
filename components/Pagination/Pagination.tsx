'use client';

import styles from './Pagination.module.css';

type PaginationProps = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  controls?: string;
};

export default function Pagination({
  hasMore,
  isLoading,
  onLoadMore,
  controls,
}: PaginationProps) {
  if (!hasMore && !isLoading) return null;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        onClick={onLoadMore}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-controls={controls}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {isLoading ? 'Завантаження…' : 'Показати ще'}
      </button>
    </div>
  );
}
