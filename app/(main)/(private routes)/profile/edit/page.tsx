import type { Metadata } from "next";
import PersonalSettings from "@/components/PersonalSettings/PersonalSettings";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Персональна інформація",
  description: "Змініть фото, email та пароль у вашому профілі.",
};

// Контейнер, відступи та авторизацію (ProfileGuard) дає profile/layout.tsx.
export default function PersonalPage() {
  return (
    <section>
      <h2 className={css.title}>Персональна інформація</h2>
      <PersonalSettings />
    </section>
  );
}
