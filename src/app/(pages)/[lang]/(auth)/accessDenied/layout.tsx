import type { Metadata } from 'next';
import '@/app/globals.css';
import ProviderLayout from '@/components/layout/ProviderLayout';

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

export default async function Layout({ children, params }: Props) {
  return (
    <ProviderLayout 
    // eslint-disable-next-line react/no-children-prop
    children={<div>{children}</div>}
    params={params}/>
  );
}
