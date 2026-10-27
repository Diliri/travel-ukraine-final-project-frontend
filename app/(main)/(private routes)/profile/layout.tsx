import type { ReactNode } from 'react';
import ProfileGuard from '@/components/Profile/ProfileGuard';
import CurrentUserInfo from '@/components/Profile/TravellerInfo/CurrentUserInfo';
import ProfileTabs from '@/components/Profile/ProfileTabs/ProfileTabs';
import EditProfileLink from '@/components/Profile/EditProfileLink/EditProfileLink';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import styles from './ProfilePage.module.css';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileGuard>
      <main className={styles.profilePageContainer}>
        <div className={styles.profilePageUser}>
          <CurrentUserInfo />
          <EditProfileLink />
          <LogoutButton />
        </div>

        <div className={styles.profilePageTabs}>
          <ProfileTabs />
        </div>

        <div className={styles.profilePageContent}>{children}</div>
      </main>
    </ProfileGuard>
  );
}
