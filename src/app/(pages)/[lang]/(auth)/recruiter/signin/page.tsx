import React from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LoginForm from '@/components/custom-form/LoginForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Recruiter Signin",
    description: "WebPage for Recruiter Signin",
};


type Props = {}

export default async function page({ }: Props) {
    const t = await getTranslations();
    return (
        <div className='mt-[-40px]'>
            <LoginForm/>
            <div className="mt-4 text-center">
                <span className="text-sm text-black">{t("signin.signup.label")}</span>
                <Link
                    href="/recruiter/signup"
                    className="ml-2 text-sm font-semibold cursor-pointer text-emerald-500 hover:underline"
                >
                    {t("signin.buttons.signup")}
                </Link>
            </div>
        </div>
    )
}