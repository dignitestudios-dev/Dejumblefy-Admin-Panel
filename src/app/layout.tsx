import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/providers";
import { ServerErrorDialog } from "@/components/common/server-error-dialog";
import { OfflineBanner } from "@/components/common/offline-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dejumblify Admin Panel",
    template: "%s | Dejumblify Admin",
  },
  description: "Administrative Management Dashboard for Dejumblify",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased bg-slate-50 text-slate-900">
        <Providers>
          {children}
          <ServerErrorDialog />
          <OfflineBanner />
        </Providers>
      </body>
    </html>
  );
}
