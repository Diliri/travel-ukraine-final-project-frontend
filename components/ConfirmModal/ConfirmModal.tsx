'use client';

import { useEffect } from 'react';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmModal({
  title = 'Ви точно хочете вийти?',
  confirmButtonText = 'Вийти',
  cancelButtonText = 'Відмінити',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !loading) {
        onCancel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel, loading]);

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onCancel}
          disabled={loading}
          aria-label="Закрити вікно"
        >
          ×
        </button>

        <h2 id="logout-title">{title}</h2>
        <p>Ми будемо сумувати за вами!</p>

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} disabled={loading}>
            {cancelButtonText}
          </button>
          <button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Вихід...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
