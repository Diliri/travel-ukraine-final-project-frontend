'use client';

import { useEffect, useRef } from 'react';
import styles from './Pagination.module.css';

type PaginationProps = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  controls?: string;
  hasError?: boolean;
};

export default function Pagination({
  hasMore,
  isLoading,
  onLoadMore,
  controls,
  hasError = false,
}: PaginationProps) {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || !hasMore || isLoading || hasError) return;

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        onLoadMore();
      }
    }, { rootMargin: '200px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isLoading, hasError, onLoadMore]);

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={sentinel} className={styles.pagination} aria-busy={isLoading}>
      {isLoading && <span role="status" className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        Завантаження історій…
      </span>}
      {hasError && <button
        type="button"
        className={styles.button}
        onClick={onLoadMore}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-controls={controls}
      >
        Спробувати ще раз
      </button>}
    </div>
  );
}
