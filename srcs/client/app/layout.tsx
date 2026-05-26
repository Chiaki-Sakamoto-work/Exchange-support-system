import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner'; // インポートはここ

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ICOICO | 交流支援制度利用促進',
    template: '%s | ICOICO',
  },
  description: '交流支援制度利用促進',
};

// RootLayout は 1つだけに絞る！
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ja' // enからjaに変更（日本語対応）
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        {/* ページの中身 */}
        {children}

        {/* 魔法のフラッシュメッセージ装置（bodyの末尾に1つだけ置く） */}
        <Toaster position='top-center' richColors />
      </body>
    </html>
  );
}
