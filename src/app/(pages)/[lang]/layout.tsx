import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { auth } from '@/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';
import SessionsProvider from '@/context/SessionProvider';
import { ReduxProvider } from '@/context/ReduxProvider';
import JSHeader from '@/components/header/JSHeader';
import Footer from '@/components/Footer';

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

export default async function RootLayout({ children, params }: Props) {
  const session = await auth();
  const messages = await getMessages();

  return (
    <html lang={params.lang}>
      <ReduxProvider>
        <SessionsProvider session={session}>
          <NextIntlClientProvider messages={messages} locale={params.lang}>

            <body className={inter.className}>
              <JSHeader />
              {children}
              {/* @ts-expect-error Async Server Component */}
              <Footer />
            </body>
            <Toaster />
          </NextIntlClientProvider>
        </SessionsProvider>
      </ReduxProvider>
    </html>
  );
}
