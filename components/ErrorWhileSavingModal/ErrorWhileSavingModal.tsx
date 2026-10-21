'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import css from './ErrorWhileSavingModal.module.css';

interface ErrorWhileSavingModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  export default function ErrorWhileSavingModal({
    isOpen,
    onClose,
  }: ErrorWhileSavingModalProps) {
    useEffect(() => {
      if (!isOpen) return;
  
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
  
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);
  
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
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
            type="button"
            className={css.closeButton}
            onClick={onClose}
            aria-label="Закрити"
          >
            <IoMdClose size={24} />
          </button>
  
          <PageTitle
            variant="modal"
            align="center"
            color="scheme1"
            marginBottom={16}
          >
            Помилка під час збереження
          </PageTitle>
  
          <p className={css.description}>
            Щоб зберегти статтю вам треба увійти, якщо ще немає облікового
            запису зареєструйтесь
          </p>
  
          <div className={css.buttonGroup}>
            <Link href="/login" className={css.loginBtn} onClick={onClose}>
              Увійти
            </Link>
            <Link href="/register" className={css.registerBtn} onClick={onClose}>
              Зареєструватись
            </Link>
          </div>
        </div>
      </div>,
      document.body
    );
  }