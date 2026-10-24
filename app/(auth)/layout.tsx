import Logo from "@/components/Logo/Logo";
import EscapeToHome from "./EscapeToHome";
import css from "./AuthLayout.module.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <div className={css.page}>
      <EscapeToHome />

      <header className={css.header}>
        <Logo />
      </header>

      <main className={css.main}>{children}</main>

      <footer className={css.footer}>
        <p className={css.copyright}>© {year} Природні Мандри</p>
      </footer>
    </div>
  );
}
