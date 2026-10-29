import { create } from 'zustand';
import type { ProfileUser } from '@/lib/api/profileApi';

type AuthStore = {
  isAuthenticated: boolean;
  user: ProfileUser | null;
  setUser: (user: ProfileUser) => void;
  clearIsAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user: ProfileUser) => {
    set(() => ({ user, isAuthenticated: true }));
  },
  clearIsAuth: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));