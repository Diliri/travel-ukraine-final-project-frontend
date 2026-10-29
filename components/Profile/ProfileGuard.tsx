'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';

type ProfileGuardProps = {
  children: ReactNode;
};

type AuthStatus = 'loading' | 'authorized' | 'unauthorized' | 'error';

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const controller = new AbortController();

    async function checkAuth() {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (response.status === 401) {
          setStatus('unauthorized');
          router.replace('/login');
          return;
        }

        if (!response.ok) {
          setStatus('error');
          return;
        }

        setStatus('authorized');
      } catch {
        if (!controller.signal.aborted) {
          setStatus('error');
        }
      }
    }

    checkAuth();

    return () => controller.abort();
  }, [router]);

  if (status === 'loading' || status === 'unauthorized') {
  //   return <p>Перевірка авторизації...</p>;
  // }
    return <Loader />;
  }

  if (status === 'error') {
    return <p role="alert">Не вдалося перевірити авторизацію. Спробуйте оновити сторінку.</p>;
  }

  return <>{children}</>;
}
