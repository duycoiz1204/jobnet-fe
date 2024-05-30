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
    const head = await headers()
    const pathname = head.get("x-pathname")!!
    const session = await auth();
    const messages = await getMessages();
    let isUseHeader = true
    if (pathname.includes("view-resume")) {
        isUseHeader = false
    }

    return (

        <html lang={params.lang}>
            <ReduxProvider>
                <SessionsProvider session={session}>
                    <NextIntlClientProvider messages={messages} locale={params.lang}>

                        <body className={inter.className}>
                            {(isUseHeader == true) ? (
                                <div className="flex">
                                    <RHeadder />
                                    <div className="flex-1 px-2 py-2 bg-white lg:p-6">
                                        {children}
                                    </div>
                                </div>
                            ) : (
                                <div>{ children }</div>
                            )}
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