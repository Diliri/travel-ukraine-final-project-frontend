import type { ReactNode } from 'react';
import ProfileGuard from '@/components/Profile/ProfileGuard';
import CurrentUserInfo from '@/components/Profile/TravellerInfo/CurrentUserInfo';
import LogoutButton from '@/components/LogoutButton/LogoutButton';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileGuard>
      <main>
        <CurrentUserInfo />
        <LogoutButton />
        {children}
      </main>
    </ProfileGuard>
  );
}
