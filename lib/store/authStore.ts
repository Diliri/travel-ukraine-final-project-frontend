"use client";

import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
