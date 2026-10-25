// ДОДАТКОВО НА ДООПРАЦЮВАННЯ -- необхідно додати ЕррорМесседж повідомлення, додати функцію приховати/показати пароль
// + Налаштувати повідомлення під українську мову;
// ++ Розібрати файл AuthForm на частини/компоненти, які відповідають ТЗ.
// +++ Додати CSS-файл для форми та відредагувтаи існуючий CSS до AuthForm.

'use client';

import css from "./LoginForm.module.css"
import AuthNavigation from "../AuthNavigation/AuthNavigation";

import { isAxiosError } from "axios";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Formik, Field } from "formik";


import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema } from "@/lib/validation/authValidation";

type LoginValues = {
  email: string;
  password: string;
};

const initialLoginValues: LoginValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);


  const handleSubmit = async (values: LoginValues) => {
    setError('');

    try {

      const res = await login(values);

      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error: unknown) {
    if (isAxiosError(error)) {
      setError(
        error.response?.data?.error ??
          error.response?.data?.message ??
          error.message ??
          "Login failed. Please try again."
      );
      return;
    }

    if (error instanceof Error) {
      setError(error.message);
      return;
    }

    setError("Login failed. Please try again.");
  }
};



  return (
    <div className={css.content}>
      <AuthNavigation />
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
          <Form>
            <label htmlFor="email">Пошта*</label>
            <Field
              id="email"
              name="email"
              placeholder="hello@podorozhnyky.ua"
              className={`${css.input} ${touched.password && errors.password ? css.inputError : ''
                }`} />
            <div className={css.field}>
              <label htmlFor="password" className={css.label}>
                Пароль*
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                className={`${css.input} ${
                  touched.password && errors.password ? css.inputError : ''
                }`}
              />
              
              {/* ДОДАТИ СЮДИ ERRORMESSAGE КОМПОНЕНТ */}

            </div>
            <button
              type="submit"
              className={css.button}
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