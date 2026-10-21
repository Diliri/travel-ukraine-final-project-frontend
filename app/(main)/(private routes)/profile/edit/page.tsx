import type { Metadata } from "next";
import PersonalSettings from "@/components/PersonalSettings/PersonalSettings";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Персональна інформація | Природні Мандри",
  description: "Змініть фото, email та пароль у вашому профілі.",
  openGraph: {
    title: "Персональна інформація | Природні Мандри",
    description: "Змініть фото, email та пароль у вашому профілі.",
  },
};

// Приватність забезпечує група (private routes) / AuthProvider.
export default function PersonalPage() {
  return (
    <div className={css.page}>
      <header className={css.header}>
        <div className={css.container}>
          <h1 className={css.title}>Персональна інформація</h1>
        </div>
      </header>
      <div className={`${css.container} ${css.content}`}>
        <PersonalSettings />
      </div>
    </div>
  );
}
