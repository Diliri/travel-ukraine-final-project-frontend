import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
