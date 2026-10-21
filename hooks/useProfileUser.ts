"use client";

import { useState } from "react";
import { getMockUser, type ProfileUser } from "@/lib/api/profileApi";

// ТИМЧАСОВО: поки authStore Скрам-майстра не готовий, користувач — локальний mock.
// ПІСЛЯ ІНТЕГРАЦІЇ заміни тіло хука на:
//   import { useAuthStore } from "@/lib/store/authStore";
//   const user = useAuthStore((s) => s.user);
//   const setUser = useAuthStore((s) => s.setUser);
//   return { user, setUser };
export function useProfileUser() {
  const [user, setUser] = useState<ProfileUser | null>(getMockUser());
  return { user, setUser };
}
