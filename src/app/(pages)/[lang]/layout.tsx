import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

type Props = Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>;

export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}