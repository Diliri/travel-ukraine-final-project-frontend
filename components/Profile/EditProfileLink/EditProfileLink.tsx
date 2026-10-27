'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './EditProfileLink.module.css';

// Вставляється в profile/layout.tsx під карткою користувача; на самій сторінці редагування прихований.
export default function EditProfileLink() {
  const pathname = usePathname();

  if (pathname === '/profile/edit') return null;

  return (
    <Link href="/profile/edit" className={styles.link}>
      Редагувати профіль
    </Link>
  );
}
