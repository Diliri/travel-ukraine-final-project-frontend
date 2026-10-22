const REQUIRED = "Обов’язкове поле";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (value: string) => {
  const v = value.trim();
  if (!v) return REQUIRED;
  if (v.length > 32) return "Максимум 32 символи";
  return "";
};

export const validateEmail = (value: string) => {
  const v = value.trim();
  if (!v) return REQUIRED;
  if (!EMAIL_RE.test(v)) return "Невалідний email";
  if (v.length > 64) return "Максимум 64 символи";
  return "";
};

export const validateCurrentPassword = (value: string) => (value ? "" : REQUIRED);

export const validateNewPassword = (value: string, current: string) => {
  if (!value) return REQUIRED;
  if (value.length < 8) return "Мінімум 8 символів";
  if (value.length > 128) return "Максимум 128 символів";
  if (value === current) return "Новий пароль має відрізнятись від поточного";
  return "";
};

export const validateConfirmPassword = (value: string, next: string) => {
  if (!value) return REQUIRED;
  if (value !== next) return "Паролі не збігаються";
  return "";
};
