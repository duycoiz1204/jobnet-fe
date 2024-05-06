import AuthenticateLayout from '@/components/layout/AuthenticateLayout';
import React from 'react'

type LayoutSize = 'xs' | 'sm' | 'md' | 'lg'

type Props =  Readonly<{
    children: React.ReactNode;
}>;

const jsLayout = {
    welcome: 'signin.jobSeeker.title',
    introduction: 'signin.jobSeeker.introduction',
    intendedFor: 'signin.jobSeeker.intended',
    padding: 'pt-10',
    backgroundImage: '/jobseeker-auth.jpg',
    layoutSize: 'sm',
    verify: false
}
const rcLayout = {
    welcome: 'signin.recruiter.title',
    introduction: 'signin.recruiter.introduction',
    intendedFor: 'signin.recruiter.intended',
    padding: 'py-10',
    backgroundImage: '/recruiter-auth.png',
    layoutSize: 'sm',
    verify: false
}
const adLayout = {
    welcome: 'signin.admin.title',
    introduction: 'signin.admin.introduction',
    intendedFor: 'signin.admin.intended',
    padding: 'pt-10',
    backgroundImage: '/recruiter-auth.png',
    layoutSize: 'sm',
    verify: false
}
export default function layout({ children }: Props) {
    return (
        <AuthenticateLayout
            welcome={'signin.jobSeeker.title'}
            introduction={'signin.jobSeeker.introduction'}
            intendedFor={'signin.jobSeeker.intended'}
            padding="pt-10"
            backgroundImage={"/jobseeker-auth.jpg"}
        >
            {children}
        </AuthenticateLayout>
    )
}