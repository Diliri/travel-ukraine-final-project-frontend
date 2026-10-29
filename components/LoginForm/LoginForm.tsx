'use client';

import css from "./LoginForm.module.css"

import { isAxiosError } from "axios";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Formik, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";


import { login, LoginRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema } from "@/lib/validation/authValidation";
import { CURRENT_USER_KEY } from "@/hooks/useCurrentUser";

type PasswordFieldProps = {
  id: string;
  autoComplete: string;
  hasError: boolean;
};


const initialLoginValues: LoginRequest = {
  email: "",
  password: "",
};

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
      if (Array.isArray(message)) {
        const messages = message.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0
        );
        if (messages.length > 0) return messages.join(". ");
      }
    }

    if (!error.response) {
      return "Не вдалося з'єднатися із сервером. Перевірте налаштування API та спробуйте ще раз.";
    }

    return "Сталася помилка. Спробуйте ще раз.";
  }

  if (error instanceof Error) return error.message;
  return "Сталася помилка. Спробуйте ще раз.";
}

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.9 5.2A9.8 9.8 0 0112 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 01-4.2 5.1M6.7 6.7A11.7 11.7 0 001 12.5C2.7 16.9 7 20 12 20c1.6 0 3.1-.3 4.5-.9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5c-1.7 4.4-6 7.5-11 7.5S2.7 16.9 1 12.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
  );
}

const LoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);


  const handleSubmit = async (
    values: LoginRequest,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const res = await login({
        email: values.email.trim(),
        password: values.password,
      });

      setUser(res);
      queryClient.setQueryData(CURRENT_USER_KEY, res);
      toast.success("Вхід успішний");
      router.push("/profile");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className={css.content}>
          <div className={css.heading}>
              <h1 className={css.title}>Вхід</h1>
              <h2 className={css.subtitle}>Вітаємо знову у спільноту мандрівників!</h2>
          </div>
          <Formik
              initialValues={initialLoginValues}
              validationSchema={loginSchema}
              validateOnBlur
              validateOnChange={false}
              onSubmit={handleSubmit}
          >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            <div className={css.field}>
            <label htmlFor="email" className={css.label}>Пошта*</label>
            <Field
              id="email"
              name="email"
              placeholder="hello@podorozhnyky.ua"
              className={`${css.input} ${touched.password && errors.password ? css.inputError : ''
                  }`} />
              <ErrorMessage name="email" component="p" className={css.error} />
            </div>
            
            <div className={css.field}>
              <label htmlFor="password" className={css.label}>
                Пароль*
              </label>
              <PasswordField
                id="password"
                autoComplete="current-password"
                hasError={Boolean(touched.password && errors.password)}
              />
              <ErrorMessage name="password" component="p" className={css.error} />
            </div>

            <button
              type="submit"
              className={css.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Входжу…" : "Увійти"}
            </button>
          </Form>
        )}
       </Formik>
</div>
  );
};

export default LoginForm;