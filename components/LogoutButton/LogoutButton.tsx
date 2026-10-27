'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import { useAuthStore } from '@/lib/store/authStore';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore(state => state.clearUser);
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

      clearUser();
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
        className={styles.button}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Вийти
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
