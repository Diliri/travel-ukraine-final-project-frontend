import Link from 'next/link';
import css from './AuthBar.module.css';

interface AuthBarProps {
  variant?: 'default' | 'inline';
}

export const AuthBar = ({ variant = 'default' }: AuthBarProps) => {
  return (
    <div className={`${css.authBar} ${variant === 'inline' ? css.inline : ''}`}>
      <Link href="/login" className={css.loginButton}>
        Вхід
      </Link>
      <Link href="/register" className={css.registerButton}>
        Реєстрація
      </Link>
    </div>
  );
};