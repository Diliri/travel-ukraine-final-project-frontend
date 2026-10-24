'use client';

import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmModal({ onConfirm, onCancel, loading = false }: ConfirmModalProps) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
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
          aria-label="Закрити вікно"
        >
          ×
        </button>

        <h2 id="logout-title">Ви точно хочете вийти?</h2>
        <p>Ми будемо сумувати за вами!</p>

        <div className={styles.actions}>
          <button onClick={onCancel} disabled={loading}>
            Відмінити
          </button>
          <button onClick={onConfirm} disabled={loading}>
            {loading ? 'Вихід...' : 'Вийти'}
          </button>
        </div>
      </div>
    </div>
  );
}
