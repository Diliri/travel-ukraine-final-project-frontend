"use client";

import { Toaster } from "react-hot-toast";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";
import { useProfileUser } from "@/hooks/useProfileUser";
import { MOCK } from "@/lib/api/profileApi";
import css from "./PersonalSettings.module.css";

export default function PersonalSettings() {
  const { user, setUser } = useProfileUser();

  if (!user) return null; // сторінка приватна: користувач уже в сторі

  return (
    <div className={css.wrapper}>
      {/* У mock-режимі свій Toaster; у «бойовому» — спільний ToastProvider команди */}
      {MOCK && <Toaster position="top-right" />}

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Профіль</h2>
        <ProfileEditForm user={user} onUpdated={setUser} />
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Зміна пароля</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
