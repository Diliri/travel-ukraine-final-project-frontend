import Link from "next/link";
import Image from "next/image";
import css from "./Logo.module.css";

// Логотип: іконка (public/images/logo.svg) + назва. Клік веде на головну сторінку.
export default function Logo() {
  return (
    <Link href="/" className={css.logo} aria-label="Природні Мандри — на головну">
      <Image src="/images/logo.svg" alt="" width={24} height={24} unoptimized />
      <span className={css.text}>
        Природні
        <br />
        Мандри
      </span>
    </Link>
  );
}
