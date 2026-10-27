import Image from 'next/image';
import css from './AuthHeader.module.css';
import Link from 'next/link';

export default function AuthHeader() {
  return (
    <header className={css.header}>
      <div className="container">
        <Link href="/" className={css.logo} aria-label="Перейти на головну">
          <Image src="/images/logo.svg" alt="" width={24} height={24} />
          <span>
            Природні
            <br />
            Мандри
          </span>
        </Link>
      </div>
    </header>
  );
}