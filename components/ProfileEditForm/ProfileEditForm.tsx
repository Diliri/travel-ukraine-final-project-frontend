"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { updateProfile, uploadAvatar, type ProfileUser } from "@/lib/api/profileApi";
import css from "@/components/PersonalSettings/form.module.css";

// Validation rules (auth form): name — max 32, required; email — email, max 64, required
const schema = Yup.object({
  name: Yup.string().trim().max(32, "Максимум 32 символи").required("Обов’язкове поле"),
  email: Yup.string()
    .trim()
    .email("Невалідний email")
    .max(64, "Максимум 64 символи")
    .required("Обов’язкове поле"),
});

interface Props {
  user: ProfileUser;
  onUpdated: (user: ProfileUser) => void;
}

export default function ProfileEditForm({ user, onUpdated }: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  return (
    <Formik
      initialValues={{ name: user.name, email: user.email }}
      validationSchema={schema}
      enableReinitialize
      onSubmit={async (values) => {
        try {
          let updated = user;
          const textChanged = values.name.trim() !== user.name || values.email.trim() !== user.email;

          if (textChanged) {
            updated = await updateProfile({ name: values.name.trim(), email: values.email.trim() });
          }
          if (avatarFile) {
            updated = await uploadAvatar(avatarFile);
          }

          onUpdated(updated);
          setAvatarFile(null);
          toast.success("Профіль оновлено");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Не вдалося оновити профіль");
        }
      }}
    >
      {({ dirty, isValid, isSubmitting, errors, touched, resetForm }) => (
        <Form className={css.form} noValidate>
          <AvatarPicker
            currentUrl={user.avatarUrl}
            file={avatarFile}
            onSelect={setAvatarFile}
            disabled={isSubmitting}
          />

          <div className={css.field}>
            <label htmlFor="name" className={css.label}>
              Ім’я та Прізвище
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ваше ім’я та прізвище"
              className={`${css.input} ${errors.name && touched.name ? css.inputError : ""}`}
            />
            <ErrorMessage name="name" component="p" className={css.error} />
          </div>

          <div className={css.field}>
            <label htmlFor="email" className={css.label}>
              Пошта
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="hello@podorozhnyky.ua"
              className={`${css.input} ${errors.email && touched.email ? css.inputError : ""}`}
            />
            <ErrorMessage name="email" component="p" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.submit}
              disabled={isSubmitting || !isValid || !(dirty || avatarFile)}
            >
              {isSubmitting ? "Збереження…" : "Зберегти"}
            </button>
            <button
              type="button"
              className={css.cancel}
              disabled={isSubmitting || !(dirty || avatarFile)}
              onClick={() => {
                resetForm();
                setAvatarFile(null);
              }}
            >
              Відмінити
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
