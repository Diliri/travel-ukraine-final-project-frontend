'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useAuthModalStore } from '@/lib/store/authModalStore';
import css from './AuthNavModal.module.css';

export default function AuthNavModal() {
  const isOpen = useAuthModalStore((s) => s.isOpen);
  const close = useAuthModalStore((s) => s.close);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={css.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          className={css.close}
          onClick={close}
          aria-label="Закрити"
        >
          ×
        </button>

        <h2 className={css.title}>Помилка під час збереження</h2>
<p className={css.text}>
  Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису
  зареєструйтесь
</p>

        <div className={css.actions}>
          <Link className={css.link} href="/auth/login" onClick={close}>
            Увійти
          </Link>
          <Link
            className={`${css.link} ${css.primary}`}
            href="/auth/register"
            onClick={close}
          >
            Зареєструватись
          </Link>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}