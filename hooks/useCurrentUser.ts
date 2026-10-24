"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/lib/api/profileApi";

// Єдиний ключ кешу поточного користувача: після збереження профілю ми оновлюємо
// його через queryClient.setQueryData(CURRENT_USER_KEY, user) — і всі, хто його читає, оновлюються.
export const CURRENT_USER_KEY = ["currentUser"] as const;

export function useCurrentUser() {
  return useQuery({ queryKey: CURRENT_USER_KEY, queryFn: fetchCurrentUser });
}
