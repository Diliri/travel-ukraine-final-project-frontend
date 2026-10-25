import type { InputHTMLAttributes } from "react";
import css from "./form.module.css";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> {
  id: string;
  label: string;
  error?: string;
}

export default function FormField({ id, label, error, ...input }: Props) {
  return (
    <div className={css.field}>
      <label htmlFor={id} className={css.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${css.input} ${error ? css.inputError : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className={css.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
