'use client';

import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import css from './UserBar.module.css';
import styles from './LogoutButton.module.css';

export const UserBar = () => {
  const user = useAuthStore(state => state.user);

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

      <LogoutButton className={css.logoutButton}>
        <Image
          src="/svg/logout-icon.svg"
          alt=""
          width={18}
          height={19}
          className={css.logoutIcon}
          unoptimized
        />
      </LogoutButton>
    </div>
  );
};
