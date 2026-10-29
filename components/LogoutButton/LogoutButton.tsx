'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useAuthStore } from '@/lib/store/authStore';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import styles from './LogoutButton.module.css';

type LogoutButtonProps = {
  children?: ReactNode;
  className?: string;
};

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearIsAuth = useAuthStore((state) => state.clearIsAuth);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Не вдалося вийти з акаунта');
      }

      clearIsAuth();
      queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
      setIsOpen(false);
      router.replace('/login');
      router.refresh();
    } catch {
      setError('Помилка виходу. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className={className ?? styles.button}
        type="button"
        aria-label={children ? 'Вийти з акаунта' : undefined}
        onClick={() => setIsOpen(true)}
      >
        {children ?? 'Вийти'}
      </button>

      {isOpen && (
        <ConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setIsOpen(false)}
          loading={loading}
        />
      )}

      {error && <p role="alert">{error}</p>}
    </>
  );
}
