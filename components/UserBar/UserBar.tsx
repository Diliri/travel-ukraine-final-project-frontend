'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import { logout } from '@/lib/api/clientApi';
import css from './UserBar.module.css';

export const UserBar = () => {
  const user = useAuthStore((state) => state.user);
  const clearIsAuth = useAuthStore((state) => state.clearIsAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuth();
      setIsModalOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className={css.userBar}>
      <Image
        src={user.avatarUrl || '/default-avatar.png'}
        alt={user.name ? `Аватар користувача ${user.name}` : 'Аватар користувача'}
        width={32}
        height={32}
        className={css.avatar}
      />
      <span className={css.userName}>{user.name || "Ім'я"}</span>
      <span className={css.divider} />

      <button
        type="button"
        className={css.logoutButton}
        aria-label="Вийти з системи"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src="/svg/logout-icon.svg"
          alt=""
          width={18}
          height={19}
          className={css.logoutIcon}
          unoptimized
        />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Ви точно хочете вийти?"
        confirmButtonText="Вийти"
        cancelButtonText="Відмінити"
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      >
        Ми будемо сумувати за вами!
      </ConfirmModal>
    </div>
  );
};
