import AuthenticateLayout from '@/components/layout/AuthenticateLayout';
import '@/app/globals.css';
import { headers } from 'next/headers';
import React from 'react'
import ProviderLayout from '@/components/layout/ProviderLayout';
type LayoutSize = 'xs' | 'sm' | 'md' | 'lg'

type Props = Readonly<{
    children: React.ReactNode;
    params: { lang: string };
}>;

const jsSignInLayout = {
    welcome: 'signin.jobSeeker.title',
    introduction: 'signin.jobSeeker.introduction',
    intendedFor: 'signin.jobSeeker.intended',
    padding: 'pt-10',
    backgroundImage: '/jobseeker-auth.jpg',
    layoutSize: 'sm',
    verify: false
}
const jsSignUpLayout = {
    welcome: 'signup.jobSeeker.title',
    introduction: 'signin.jobSeeker.introduction',
    intendedFor: 'signup.jobSeeker.intended',
    padding: 'pt-10',
    backgroundImage: '/jobseeker-auth.jpg',
    layoutSize: 'sm',
    verify: false
}
const jsVerifyLayout = {
    welcome: 'verify.jobSeeker.welcome',
    introduction: 'signin.jobSeeker.introduction',
    intendedFor: 'verify.jobSeeker.intended',
    padding: 'py-6',
    backgroundImage: '/otp-layout.png',
    layoutSize: 'sm',
    verify: true
}
const rcSignInLayout = {
    welcome: 'signin.recruiter.title',
    introduction: 'signin.recruiter.introduction',
    intendedFor: 'signin.recruiter.intended',
    padding: 'py-10',
    backgroundImage: '/recruiter-auth.png',
    layoutSize: 'sm',
    verify: false
}
const rcSignUpLayout = {
    welcome: 'signup.recruiter.title',
    introduction: 'signin.recruiter.introduction',
    intendedFor: 'signup.recruiter.intended',
    padding: 'py-4',
    backgroundImage: '/recruiter-auth.png',
    layoutSize: 'lg',
    verify: false
}
const adSignInLayout = {
    welcome: 'signin.admin.title',
    introduction: 'signin.admin.introduction',
    intendedFor: 'signin.admin.intended',
    padding: 'pt-10',
    backgroundImage: '/recruiter-auth.png',
    layoutSize: 'sm',
    verify: false
}

export default async function Layout({ children, params }: Props) {
    const header = headers()
    const pathname = header.get("x-pathname")
    const { welcome, introduction, intendedFor, padding, backgroundImage, layoutSize } =
        (pathname?.includes("recruiter")) ? (
            (pathname?.includes("signin")) ? rcSignInLayout : rcSignUpLayout
        ) : (
            pathname?.includes("admin") ? adSignInLayout : (
                (pathname?.includes("verify")) ? jsVerifyLayout : (
                    (pathname?.includes("signin")) ? jsSignInLayout : jsSignUpLayout
                )
            )
        )

    return (
        <ProviderLayout
            // eslint-disable-next-line react/no-children-prop
            children={
                <AuthenticateLayout
                    welcome={welcome}
                    introduction={introduction}
                    intendedFor={intendedFor}
                    padding={padding}
                    backgroundImage={backgroundImage}
                    layoutSize={layoutSize as LayoutSize}
                >
                    {children}
                </AuthenticateLayout>
            }
            params={params} />
    )
}