'use client';

import TravellerInfo from './TravellerInfo';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Читає користувача з того самого react-query кешу, що й сторінка /profile/edit,
// тому картка профілю оновлюється одразу після збереження змін.
export default function CurrentUserInfo() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <p>Завантаження профілю...</p>;
  }

  if (isError || !user) {
    return <p role="alert">Не вдалося завантажити дані користувача.</p>;
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
