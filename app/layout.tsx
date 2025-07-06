import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "DevNote - 個人開発プロジェクトポートフォリオ",
  description: "個人開発者向けのポートフォリオアプリケーション。開発したプロジェクトを整理・公開し、技術力をアピールできるプラットフォームです。",
  openGraph: {
    title: "DevNote - 個人開発プロジェクトポートフォリオ",
    description: "個人開発者向けのポートフォリオアプリケーション。開発したプロジェクトを整理・公開し、技術力をアピールできるプラットフォームです。",
    url: "https://dev-note-rho.vercel.app",
    siteName: "DevNote",
    images: [
      {
        url: "https://dev-note-rho.vercel.app/icon.png",
        width: 1200,
        height: 630,
        alt: "DevNote - 個人開発プロジェクトポートフォリオ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevNote - 個人開発プロジェクトポートフォリオ",
    description: "個人開発者向けのポートフォリオアプリケーション。開発したプロジェクトを整理・公開し、技術力をアピールできるプラットフォームです。",
    images: ["https://dev-note-rho.vercel.app/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
