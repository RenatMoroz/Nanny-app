import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import TanstackProvider from '@/components/providers/TanstackProvider';
import AuthInitializer from '@/components/AuthInitializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nanny.Services',
  description:
    'Nanny.Services - Your trusted platform for finding reliable nannies and babysitters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TanstackProvider>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster position="top-right" />
        </TanstackProvider>
      </body>
    </html>
  );
}
