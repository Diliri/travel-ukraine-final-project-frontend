import * as Yup from "yup";

// Правила як на бекенді (Joi): name 2–32, email max 64, password 8–128

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Мінімум 2 символи")
    .max(32, "Максимум 32 символи")
    .required("Це поле обов'язкове"),
  email: Yup.string()
    .trim()
    .email("Введіть коректну адресу електронної пошти")
    .max(64, "Максимум 64 символи")
    .required("Це поле обов'язкове"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .max(128, "Максимум 128 символів")
    .required("Це поле обов'язкове"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Введіть коректну адресу електронної пошти")
    .max(64, "Максимум 64 символи")
    .required("Це поле обов'язкове"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .max(128, "Максимум 128 символів")
    .required("Це поле обов'язкове"),
});
