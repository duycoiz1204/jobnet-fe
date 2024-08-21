import type { Metadata } from 'next';
import '@/app/globals.css';
import { headers } from 'next/headers';
import Footer from '@/components/Footer';
import RHeadder from '@/components/header/RHeader';
import ProviderLayout from '@/components/layout/ProviderLayout';
import RcSidebar from '@/components/sidebar/RcSidebar';
import { log } from 'console';

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
    return (
        <div className={`flex pt-20`}>
            <RcSidebar/>
            <div className="flex-1 p-5 bg-white z-0">
                {children}
            </div>
        </div>
    );
}