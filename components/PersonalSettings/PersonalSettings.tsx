"use client";

import { useQueryClient } from "@tanstack/react-query";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";
import { CURRENT_USER_KEY, useCurrentUser } from "@/hooks/useCurrentUser";
import type { ProfileUser } from "@/lib/api/profileApi";
import css from "./PersonalSettings.module.css";

export default function PersonalSettings() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <p>Завантаження профілю...</p>;
  if (isError || !user) return <p>Не вдалося завантажити дані користувача.</p>;

  const handleUpdated = (updated: ProfileUser) =>
    queryClient.setQueryData(CURRENT_USER_KEY, updated);

  return (
    <div className={css.wrapper}>
      <section className={css.section}>
        <h3>Профіль</h3>
        <ProfileEditForm user={user} onUpdated={handleUpdated} />
      </section>

      <section className={css.section}>
        <h3>Зміна пароля</h3>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
