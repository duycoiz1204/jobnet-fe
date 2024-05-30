import type { Metadata } from 'next';
import '@/app/globals.css';
import RcSidebar from '@/components/sidebar/RcSidebar';
import { headers } from 'next/headers';
import { ReduxProvider } from '@/context/ReduxProvider';
import SessionsProvider from '@/context/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { auth } from '@/auth';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { boolean } from 'zod';
import Footer from '@/components/Footer';
import RHeadder from '@/components/header/RHeader';
import ADHeader from '@/components/header/ADHeader';

export const metadata: Metadata = {
    title: 'Recruiter Home',
    description: 'Recruiter Home page',
};

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'vi' }];
}

type Props = Readonly<{
    children: React.ReactNode;
    params: { lang: string };
}>;
const inter = Inter({ subsets: ['latin'] });

export default async function Layout({ children, params }: Props) {
    const session = await auth();
    const messages = await getMessages();

    return (
        <html lang={params.lang}>
            <ReduxProvider>
                <SessionsProvider session={session}>
                    <NextIntlClientProvider messages={messages} locale={params.lang}>

                        <body className={inter.className}>
                            <div>{children}</div>
                        </body>
                        <Toaster />
                    </NextIntlClientProvider>
                </SessionsProvider>
            </ReduxProvider>
        </html>
    );
}