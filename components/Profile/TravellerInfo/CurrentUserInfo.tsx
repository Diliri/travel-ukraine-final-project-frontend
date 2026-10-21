'use client';

import { useEffect, useState } from 'react';
import TravellerInfo from './TravellerInfo';

type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
};

export default function CurrentUserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Не вдалося завантажити профіль');
        }

        const data: User = await response.json();
        setUser(data);
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p>Завантаження профілю...</p>;
  }

  if (error || !user) {
    return <p>Не вдалося завантажити дані користувача.</p>;
  }

  return (
    <TravellerInfo
      name={user.name}
      email={user.email}
      avatarUrl={user.avatarUrl}
      articlesAmount={user.articlesAmount}
    />
  );
}
