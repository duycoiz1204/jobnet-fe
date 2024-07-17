import type { Metadata } from 'next';
import '@/app/globals.css';
import { headers } from 'next/headers';
import Footer from '@/components/Footer';
import RHeadder from '@/components/header/RHeader';
import ProviderLayout from '@/components/layout/ProviderLayout';

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

export default async function Layout({ children, params }: Props) {
    const head = await headers()
    const pathname = head.get("x-pathname")!!
    let isUseHeader = true
    if (pathname.includes("view-resume")) {
        isUseHeader = false
    }

    return (
        // eslint-disable-next-line react/no-children-prop
        <ProviderLayout children={
            (<div>
                {(isUseHeader == true) ? (
                    <div className="flex">
                        <RHeadder />
                        <div className="flex-1 px-2 py-2 bg-white lg:p-6">
                            {children}
                        </div>
                    </div>

                ) : (
                    <div>{children} </div>
                )}
                <Footer />
            </div>)
        } params={params} />
    );
}