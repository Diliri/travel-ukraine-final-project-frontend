'use client';

import Link from 'next/link';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useAuthStore } from '@/lib/store/authStore';
import { AuthBar } from '@/components/AuthBar/AuthBar';
import { UserBar } from '@/components/UserBar/UserBar';
import css from './BurgerMenu.module.css';

interface NavLink {
  href: string;
  label: string;
}

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export const BurgerMenu = ({ isOpen, onClose, links }: BurgerMenuProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={css.overlay}>
      <div className={`container ${css.panel}`}>
        <div className={css.topBar}>
          <Link href="/" className={css.logo} aria-label="Перейти на головну" onClick={onClose}>
            <Image src="/images/logo.svg" alt="" width={24} height={24} />
            <span>
              Природні
              <br />
              Мандри
            </span>
          </Link>

          <div className={css.topBarActions}>
            {isAuthenticated ? (
              <Link
                href="/stories/new"
                className={css.topBarPublishButton}
                onClick={onClose}
              >
                Опублікувати статтю
              </Link>
            ) : (
              <div className={css.topBarAuthBar}>
                <AuthBar variant="inline" />
              </div>
            )}

            <button
              type="button"
              className={css.closeButton}
              aria-label="Закрити меню"
              onClick={onClose}
            >
              <RxCross2 size={24} />
            </button>
          </div>
        </div>

        <nav className={css.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={css.navLink} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={css.bottomGroup}>
          {isAuthenticated && (
            <Link href="/stories/new" className={css.publishButton} onClick={onClose}>
              Опублікувати статтю
            </Link>
          )}

          {isAuthenticated ? (
            <UserBar />
          ) : (
            <div className={css.bottomAuthBar}>
              <AuthBar />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};