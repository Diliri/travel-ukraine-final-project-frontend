"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { updatePassword } from "@/lib/api/profileApi";
import css from "@/components/PersonalSettings/form.module.css";

// Validation rules (auth form): password — min 8, max 128, required
const schema = Yup.object({
  currentPassword: Yup.string().required("Обов’язкове поле"),
  newPassword: Yup.string()
    .min(8, "Мінімум 8 символів")
    .max(128, "Максимум 128 символів")
    .notOneOf([Yup.ref("currentPassword")], "Новий пароль має відрізнятись від поточного")
    .required("Обов’язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Паролі не збігаються")
    .required("Обов’язкове поле"),
});

const fields = [
  { name: "currentPassword", label: "Поточний пароль", autoComplete: "current-password" },
  { name: "newPassword", label: "Новий пароль", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Повторіть новий пароль", autoComplete: "new-password" },
] as const;

export default function ChangePasswordForm() {
  return (
    <Formik
      initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      validationSchema={schema}
      onSubmit={async ({ currentPassword, newPassword }, { resetForm }) => {
        try {
          await updatePassword({ currentPassword, newPassword });
          toast.success("Пароль змінено");
          resetForm();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Не вдалося змінити пароль");
        }
      }}
    >
      {({ dirty, isValid, isSubmitting, errors, touched, resetForm }) => (
        <Form className={css.form} noValidate>
          {fields.map(({ name, label, autoComplete }) => (
            <div key={name} className={css.field}>
              <label htmlFor={name} className={css.label}>
                {label}
              </label>
              <Field
                id={name}
                name={name}
                type="password"
                autoComplete={autoComplete}
                placeholder="********"
                className={`${css.input} ${errors[name] && touched[name] ? css.inputError : ""}`}
              />
              <ErrorMessage name={name} component="p" className={css.error} />
            </div>
          ))}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.submit}
              disabled={isSubmitting || !dirty || !isValid}
            >
              {isSubmitting ? "Збереження…" : "Змінити пароль"}
            </button>
            <button
              type="button"
              className={css.cancel}
              disabled={isSubmitting || !dirty}
              onClick={() => resetForm()}
            >
              Відмінити
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
