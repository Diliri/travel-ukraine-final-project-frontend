"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import css from "./AvatarPicker.module.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 1; // як у story form

interface Props {
  currentUrl?: string;
  file: File | null;
  onSelect: (file: File) => void;
  disabled?: boolean;
}

export default function AvatarPicker({ currentUrl, file, onSelect, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openDialog = () => {
    if (!inputRef.current) return;
    inputRef.current.value = ""; // щоб повторний вибір того ж файлу теж спрацьовував
    inputRef.current.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      toast.error("Дозволені формати: JPG, PNG, WEBP");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Максимальний розмір файлу — ${MAX_SIZE_MB} МБ`);
      return;
    }
    onSelect(selected);
  };

  return (
    <div className={css.field}>
      <p className={css.label}>Фото профілю</p>
      <div className={css.row}>
        <Image
          src={preview ?? currentUrl ?? "/svg/avatar.svg"}
          alt="Аватар користувача"
          width={120}
          height={120}
          className={css.avatar}
          unoptimized
        />
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className={css.input}
          onChange={handleChange}
        />
        <button type="button" className={css.button} onClick={openDialog} disabled={disabled}>
          Завантажити фото
        </button>
      </div>
    </div>
  );
}
