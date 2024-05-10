import LoginForm from '@/components/custom-form/LoginForm';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "JobSeeker Signin",
    description: "WebPage for JobSeeker Signin",
};


export default async function Signin({ params }: { params: { lang: string } }) {
    const t = await getTranslations()
    return (
        <div>
            <LoginForm />
            <div className="mt-4 text-center">
                <span className="text-black">{t("signin.signup.label")}</span>{' '}
                <Link
                    href="/signup"
                    className="font-semibold cursor-pointer text-emerald-500 hover:text-emerald-700"
                >
                    {t("signin.buttons.signup")}
                </Link>
            </div>
        </div>


    )
}

