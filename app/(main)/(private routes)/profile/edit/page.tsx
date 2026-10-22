import type { Metadata } from "next";
import PersonalSettings from "@/components/PersonalSettings/PersonalSettings";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Персональна інформація",
  description: "Змініть фото, email та пароль у вашому профілі.",
};

// Авторизацію перевіряє ProfileGuard у profile/layout.tsx.
export default function PersonalPage() {
  return (
    <section className={`container ${css.page}`}>
      <h2 className={css.title}>Персональна інформація</h2>
      <PersonalSettings />
    </section>
  );
}
