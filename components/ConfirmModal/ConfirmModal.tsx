'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import css from './ConfirmModal.module.css';
import { IoMdClose } from 'react-icons/io';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  isOpen,
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onCancel}
          aria-label="Close"
        >
          <IoMdClose size={24} />
        </button>

        <PageTitle
          variant="modal"
          align="center"
          color="scheme1"
          marginBottom={16}
        >
          {title}
        </PageTitle>

        {children && <p className={css.description}>{children}</p>}

        <div className={css.buttonGroup}>
          <button className={css.cancelBtn} onClick={onCancel}>
            {cancelButtonText}
          </button>
          <button className={css.confirmBtn} onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};