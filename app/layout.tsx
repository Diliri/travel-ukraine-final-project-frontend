import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ToastProvider from "@/components/ToastProvider/ToastProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Природні Мандри",
  description:
    "Спільнота свідомих мандрівників: історії подорожей та екотуризм в Україні",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body className={montserrat.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
