import RcSignUpForm from '@/app/(pages)/[lang]/(auth)/recruiter/signup/signup-recruiter'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Recruiter Signup",
    description: "WebPage for Recruiter Signup",
};

type Props = {}

export default function page({}: Props) {
  return (
    <RcSignUpForm/>
  )
}