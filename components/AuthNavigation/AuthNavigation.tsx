"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const pathname = usePathname();
  const isRegister = pathname.startsWith("/register");
  const isLogin = pathname.startsWith("/login");

  return (
    <nav className={css.nav} aria-label="Авторизація">
      <Link
        href="/register"
        className={`${css.tab}${isRegister ? ` ${css.tabActive}` : ""}`}
      >
        Реєстрація
      </Link>
      <Link
        href="/login"
        className={`${css.tab}${isLogin ? ` ${css.tabActive}` : ""}`}
      >
        Вхід
      </Link>
    </nav>
  );
}
