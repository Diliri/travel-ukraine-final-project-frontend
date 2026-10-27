'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './ErrorWhileSavingModal.module.css';

type ErrorWhileSavingModalProps = {
  onClose: () => void;
};

export default function ErrorWhileSavingModal({ onClose }: ErrorWhileSavingModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saving-modal-title"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрити вікно"
        >
          ×
        </button>
        <h2 id="saving-modal-title">Увійдіть, щоб зберегти статтю</h2>
        <p>Збережені статті будуть доступні у вашому профілі.</p>
        <div className={styles.actions}>
          <Link href="/login">Увійти</Link>
          <Link href="/register">Зареєструватися</Link>
        </div>
      </section>
    </div>
  );
}
