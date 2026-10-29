'use client';

import { ReactNode, useEffect, useState } from 'react';

import Loader from '@/components/Loader/Loader'
import { useAuthStore } from '@/lib/store/authStore';
import { fetchCurrentUser } from '@/lib/api/profileApi';

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuth);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  // Показуємо лоудер під час перевірки сесії
  if (isLoading) return <Loader />;

  return children;
}