import '@/app/globals.css';
import { auth } from '@/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';
import SessionsProvider from '@/context/SessionProvider';
import { ReduxProvider } from '@/context/ReduxProvider';
import { HubspotConversationsProvider } from '@/context/HubspotConversationsProvider';
import Script from 'next/script';


export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'vi' }];
}

type Props = {
    children: React.ReactNode;
    params: { lang: string };
}

export default async function ProviderLayout({ children, params }: Props) {
    const session = await auth();
    const messages = await getMessages();

    return (
        <html>
            <Script id='huspot-widget'>{`
                 window.hsConversationsSettings = {
                    loadImmediately: false, 
                    inlineEmbedSelector: '#hubspot-conversations-inline-embed-selector'
                    }
            `}</Script>
            <Script
                src="//js-na1.hs-scripts.com/46692044.js"
                strategy="lazyOnload"
            />
            <ReduxProvider>
                <SessionsProvider session={session}>
                    <NextIntlClientProvider messages={messages} locale={params.lang}>
                        <body>
                            {children}
                            <HubspotConversationsProvider />
                        </body>
                        <Toaster />
                    </NextIntlClientProvider>
                </SessionsProvider>
            </ReduxProvider>
        </html>

    );
}


