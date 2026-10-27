"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import { registerSchema } from "@/lib/validation/authValidation";
import css from "./AuthForm.module.css";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};


function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; status?: number }
      | undefined;
    return data?.message || "Сталася помилка. Спробуйте ще раз.";
  }

  if (error instanceof Error) return error.message;
  return "Сталася помилка. Спробуйте ще раз.";
}

type PasswordFieldProps = {
  id: string;
  autoComplete: string;
  hasError: boolean;
};

function PasswordField({ id, autoComplete, hasError }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={css.passwordWrap}>
      <Field
        id={id}
        name="password"
        type={visible ? "text" : "password"}
        placeholder="********"
        className={`${css.input} ${css.passwordInput}${
          hasError ? ` ${css.inputError}` : ""
        }`}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={css.togglePassword}
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Сховати пароль" : "Показати пароль"}
        aria-pressed={visible}
      >
        {visible ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.9 5.2A9.8 9.8 0 0112 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 01-4.2 5.1M6.7 6.7A11.7 11.7 0 001 12.5C2.7 16.9 7 20 12 20c1.6 0 3.1-.3 4.5-.9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5c-1.7 4.4-6 7.5-11 7.5S2.7 16.9 1 12.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12.5"
              r="3"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function AuthForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const title = "Реєстрація";
  const subtitle = "Раді вас бачити у спільноті мандрівників!";
  const submitLabel = "Зареєструватись";

  const initialValues: RegisterValues = {
      name: "",
      email: "",
      password: "",
    };

    return (
      <div className={css.content}>

        <div className={css.heading}>
          <h1 className={css.title}>{title}</h1>
          <p className={css.subtitle}>{subtitle}</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          validateOnBlur
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await register({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
              });
              const user = "user" in result ? result.user : result;

              setUser(user);
              toast.success("Реєстрація успішна");
              router.push("/profile");
            } catch (error) {
              toast.error(getErrorMessage(error));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={css.form} noValidate>
              <div className={css.field}>
                <label className={css.label} htmlFor="name">
                  Імʼя та Прізвище*
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ваше імʼя та прізвище"
                  className={`${css.input}${
                    touched.name && errors.name ? ` ${css.inputError}` : ""
                  }`}
                  autoComplete="name"
                />
                <ErrorMessage name="name" component="p" className={css.error} />
              </div>

              <div className={css.field}>
                <label className={css.label} htmlFor="email">
                  Пошта*
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@podorozhnyky.ua"
                  className={`${css.input}${
                    touched.email && errors.email ? ` ${css.inputError}` : ""
                  }`}
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className={css.error}
                />
              </div>

              <div className={css.field}>
                <label className={css.label} htmlFor="password">
                  Пароль*
                </label>
                <PasswordField
                  id="password"
                  autoComplete="new-password"
                  hasError={Boolean(touched.password && errors.password)}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className={css.error}
                />
              </div>

              <button
                type="submit"
                className={css.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Реєструюсь…" : submitLabel}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
}
