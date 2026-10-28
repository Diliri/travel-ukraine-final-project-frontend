'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen?: boolean;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  loading?: boolean;
};

export function ConfirmModal({
  isOpen = true,
  title = 'Вийти з акаунта?',
  confirmButtonText = 'Вийти',
  cancelButtonText = 'Скасувати',
  onConfirm,
  onCancel,
  children,
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onCancel, loading]);

  if (!isOpen || typeof document === 'undefined') return null;
  const content = (
    <div className={styles.backdrop ?? styles.overlay} onClick={(event) => {
      if (event.target === event.currentTarget && !loading) onCancel();
    }} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onCancel} aria-label="Закрити" disabled={loading}>
          <IoMdClose size={24} />
        </button>
        {title === 'Вийти з акаунта?' ? <h2>{title}</h2> : (
          <PageTitle variant="modal" align="center" color="scheme1" marginBottom={16}>{title}</PageTitle>
        )}
        {children ? <div className={styles.description}>{children}</div> : <p>Ви впевнені, що хочете вийти?</p>}
        <div className={styles.buttonGroup ?? styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>{cancelButtonText}</button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={loading}>{loading ? 'Вихід...' : confirmButtonText}</button>
        </div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
}

export default ConfirmModal;