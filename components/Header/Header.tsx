'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { AuthBar } from '@/components/AuthBar/AuthBar';
import { UserBar } from '@/components/UserBar/UserBar';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import css from './Header.module.css';
import { RxHamburgerMenu } from "react-icons/rx";
import darkcss from './Dark.module.css'
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/components/ThemeContext/ThemeContext';

const navLinks = [
  { href: '/', label: 'Головна' },
  { href: '/stories', label: 'Статті' },
  { href: '/travellers', label: 'Еко-Мандрівники' },
];

const privateNavLinks = [{ href: '/profile', label: 'Мій Профіль' }];

export default function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  const links = isAuthenticated ? [...navLinks, ...privateNavLinks] : navLinks;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.offsetHeight}px`
      );
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, []);

  const { isDark, toggleTheme } = useTheme();

  return (
    <header ref={headerRef} className={css.header}>
      <div className={`container ${css.content}`}>
        <Link href="/" className={css.logo} aria-label="Перейти на головну">
          <Image src="/svg/logo.svg" alt="" width={24} height={24} />
          <span>
            Природні
            <br />
            Мандри
          </span>
        </Link>

        <div className={darkcss.toggleSwitch}>
          <button
            type="button"
            className={`${darkcss.themeToggle} ${isDark ? darkcss.isDark : ''}`}
            onClick={toggleTheme}
            aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            aria-pressed={isDark}
          >
            <span className={darkcss.toggleThumb} aria-hidden="true">
              {isDark ? <FiSun /> : <FiMoon />}
            </span>
          </button>
        </div>

        <div className={css.rightGroup}>
          <nav className={css.nav} aria-label="Навігація">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={css.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={css.wrapper}>
            {isAuthenticated && (
              <Link href="/stories/new" className={css.publishButton}>
                Опублікувати статтю
              </Link>
            )}

            {!isAuthenticated && (
              <div className={css.actions}>
                <AuthBar variant="inline" />
              </div>
            )}

            {isAuthenticated && (
              <div className={css.desktopUserActions}>
                <UserBar />
              </div>
            )}

            <button
              type="button"
              className={css.burgerButton}
              aria-label="Відкрити меню"
              onClick={() => setIsMenuOpen(true)}
            >
              <RxHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={links}
      />
    </header>
  );
}