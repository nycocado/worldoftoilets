import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { CsrfProvider } from '@/context/CsrfContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { pt } from '@/locales/pt';

import { Toaster } from '@/components/ui/sonner';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: pt.metadata.title,
  description: pt.metadata.description,
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CsrfProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </CsrfProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
