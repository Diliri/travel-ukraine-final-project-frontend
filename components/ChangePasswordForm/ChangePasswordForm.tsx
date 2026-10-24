"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/PersonalSettings/FormField";
import {
  validateConfirmPassword,
  validateCurrentPassword,
  validateNewPassword,
} from "@/components/PersonalSettings/validators";
import { ApiError, updatePassword } from "@/lib/api/profileApi";
import css from "@/components/PersonalSettings/form.module.css";

type Field = "currentPassword" | "newPassword" | "confirmPassword";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };
const NOT_TOUCHED = { currentPassword: false, newPassword: false, confirmPassword: false };

export default function ChangePasswordForm() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState(NOT_TOUCHED);
  const [serverCurrentError, setServerCurrentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = {
    currentPassword: serverCurrentError || validateCurrentPassword(values.currentPassword),
    newPassword: validateNewPassword(values.newPassword, values.currentPassword),
    confirmPassword: validateConfirmPassword(values.confirmPassword, values.newPassword),
  };
  const hasErrors = Boolean(errors.currentPassword || errors.newPassword || errors.confirmPassword);
  const isDirty = Object.values(values).some(Boolean);

  const handleChange = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "currentPassword") setServerCurrentError("");
  };

  const handleBlur = (field: Field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const reset = () => {
    setValues(EMPTY);
    setTouched(NOT_TOUCHED);
    setServerCurrentError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Пароль змінено");
      reset();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setServerCurrentError(error.message); // «Поточний пароль невірний»
      } else {
        toast.error(error instanceof Error ? error.message : "Не вдалося змінити пароль");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const show = (field: Field) => (touched[field] || (field === "currentPassword" && serverCurrentError)
    ? errors[field]
    : "");

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <FormField
        id="current-password"
        label="Поточний пароль"
        type="password"
        autoComplete="current-password"
        placeholder="********"
        value={values.currentPassword}
        onChange={handleChange("currentPassword")}
        onBlur={handleBlur("currentPassword")}
        error={show("currentPassword")}
      />
      <FormField
        id="new-password"
        label="Новий пароль"
        type="password"
        autoComplete="new-password"
        placeholder="********"
        value={values.newPassword}
        onChange={handleChange("newPassword")}
        onBlur={handleBlur("newPassword")}
        error={show("newPassword")}
      />
      <FormField
        id="confirm-password"
        label="Повторіть новий пароль"
        type="password"
        autoComplete="new-password"
        placeholder="********"
        value={values.confirmPassword}
        onChange={handleChange("confirmPassword")}
        onBlur={handleBlur("confirmPassword")}
        error={show("confirmPassword")}
      />

      <div className={css.actions}>
        <button type="submit" className={css.submit} disabled={isSubmitting || !isDirty || hasErrors}>
          {isSubmitting ? "Збереження…" : "Змінити пароль"}
        </button>
        <button
          type="button"
          className={css.cancel}
          onClick={reset}
          disabled={isSubmitting || !isDirty}
        >
          Відмінити
        </button>
      </div>
    </form>
  );
}
