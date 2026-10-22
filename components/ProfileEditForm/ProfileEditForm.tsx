"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import FormField from "@/components/PersonalSettings/FormField";
import { validateEmail, validateName } from "@/components/PersonalSettings/validators";
import { ApiError, updateProfile, uploadAvatar, type ProfileUser } from "@/lib/api/profileApi";
import css from "@/components/PersonalSettings/form.module.css";

interface Props {
  user: ProfileUser;
  onUpdated: (user: ProfileUser) => void;
}

export default function ProfileEditForm({ user, onUpdated }: Props) {
  const [values, setValues] = useState({ name: user.name, email: user.email });
  const [touched, setTouched] = useState({ name: false, email: false });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [serverEmailError, setServerEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = {
    name: validateName(values.name),
    email: serverEmailError || validateEmail(values.email),
  };
  const hasErrors = Boolean(errors.name || errors.email);
  const isDirty =
    values.name.trim() !== user.name || values.email.trim() !== user.email || avatarFile !== null;

  const handleChange = (field: "name" | "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "email") setServerEmailError("");
  };

  const handleBlur = (field: "name" | "email") => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleCancel = () => {
    setValues({ name: user.name, email: user.email });
    setTouched({ name: false, email: false });
    setServerEmailError("");
    setAvatarFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (hasErrors || !isDirty) return;

    setIsSubmitting(true);
    try {
      const name = values.name.trim();
      const email = values.email.trim();

      if (name !== user.name || email !== user.email) {
        const updated = await updateProfile({ name, email });
        onUpdated(updated);
        setValues({ name: updated.name, email: updated.email });
      }
      if (avatarFile) {
        const updated = await uploadAvatar(avatarFile);
        onUpdated(updated);
        setAvatarFile(null);
      }
      toast.success("Профіль оновлено");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setServerEmailError(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Не вдалося оновити профіль");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <AvatarPicker
        currentUrl={user.avatarUrl}
        file={avatarFile}
        onSelect={setAvatarFile}
        disabled={isSubmitting}
      />

      <FormField
        id="profile-name"
        label="Ім’я та Прізвище"
        type="text"
        autoComplete="name"
        placeholder="Ваше ім’я та прізвище"
        value={values.name}
        onChange={handleChange("name")}
        onBlur={handleBlur("name")}
        error={touched.name ? errors.name : ""}
      />

      <FormField
        id="profile-email"
        label="Пошта"
        type="email"
        autoComplete="email"
        placeholder="hello@podorozhnyky.ua"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        error={touched.email || serverEmailError ? errors.email : ""}
      />

      <div className={css.actions}>
        <button type="submit" className={css.submit} disabled={isSubmitting || !isDirty || hasErrors}>
          {isSubmitting ? "Збереження…" : "Зберегти"}
        </button>
        <button
          type="button"
          className={css.cancel}
          onClick={handleCancel}
          disabled={isSubmitting || !isDirty}
        >
          Відмінити
        </button>
      </div>
    </form>
  );
}
