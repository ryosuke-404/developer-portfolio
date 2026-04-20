import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Variable font — weight 400-900 animates continuously (no discrete steps)
const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Yoshioka Ryosuke — Creative Developer',
  description: '日常の小さな驚きをデザインに変える。Creative Developer & Designer。',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
