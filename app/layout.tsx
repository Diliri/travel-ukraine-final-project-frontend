import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import 'modern-normalize/modern-normalize.css';
import 'izitoast/dist/css/iziToast.min.css';
import "./globals.css";

import QueryProvider from './providers/QueryProvider';
import ToastProvider from '@/components/ToastProvider/ToastProvider';
// import AuthNavModal from '@/components/AuthNavModal/AuthNavModal';
// import { Providers } from './providers/ThemeProvider';
// import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const montserrat = Montserrat({
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl!),
  title: { default: 'Подорожуй Україною', template: '%s | Подорожі Україною' },
  description:
    'Платформа для мандрівників Україною: переглядай історії інших та ділися своїми.',
  keywords: ['travel', 'stories', 'social network'],
  openGraph: {
    title: 'Подорожі Україною',
    description:
      'Платформа для мандрівників Україною: переглядай історії інших та ділися своїми.',
    url: '/',
    siteName: 'Подорожі Україною',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/preview.png`,
        width: 1200,
        height: 630,
        alt: 'Travel Ukraine preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Подорожі Україною',
    description:
      'Платформа для мандрівників Україною: переглядай історії інших та ділися своїми.',
    images: ['/preview.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${montserrat.variable}`}>
        <QueryProvider>
          {/* <Providers>{children}</Providers> функція на день-ніч тему*/}
          {/* <Header /> в мейн лейаут*/}
            <main>{children}</main>
          <ToastProvider />
          {/* <AuthNavModal /> */}
          <div id="modal-root" />
        </QueryProvider>
      </body>
    </html>
  );
}