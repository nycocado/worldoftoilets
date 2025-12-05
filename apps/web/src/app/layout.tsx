import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CsrfProvider } from "@/context/CsrfContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Added bolder weights for headers
  display: "swap",
});

export const metadata: Metadata = {
  title: "World of Toilets - Admin Dashboard",
  description: "Dashboard administrativo para gestão da plataforma World of Toilets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CsrfProvider>
            <AuthProvider>{children}</AuthProvider>
          </CsrfProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}