"use client";

import css from "./Copyright.module.css";

export default function Copyright() {
  return (
    <p className={css.text} suppressHydrationWarning>
      © {new Date().getFullYear()} Природні Мандри. Усі права захищені.
    </p>
  );
}
