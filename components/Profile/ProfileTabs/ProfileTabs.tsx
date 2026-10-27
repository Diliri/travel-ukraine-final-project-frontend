'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ProfileTabs.module.css';

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav className={styles.profileTabs} aria-label="Розділи профілю">
      <Link
        href="/profile/saved"
        className={`${styles.profileTabsLink} ${
          pathname === '/profile/saved' ? styles.profileTabsActive : ''
        }`}
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={`${styles.profileTabsLink} ${
          pathname === '/profile/own' ? styles.profileTabsActive : ''
        }`}
      >
        Мої історії
      </Link>
    </nav>
  );
}
