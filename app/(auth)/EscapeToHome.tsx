"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Escape на auth-сторінках → головна (як закриття «вікна» реєстрації/входу). */
export default function EscapeToHome() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      router.push("/");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
