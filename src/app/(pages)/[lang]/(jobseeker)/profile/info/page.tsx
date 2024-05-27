import JsInfo from '@/app/(pages)/[lang]/(jobseeker)/profile/info/JsInfo';
import { auth } from '@/auth';
import jobSeekerService from '@/services/jobSeekerService';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'JobSeeker Infor Page',
  description: 'Information Page for JobSeeker in our Jobnet Website',
};

type Props = {};

export default async function page({}: Props) {
  const session = await auth();
  const _jobSeeker = await jobSeekerService.getJobSeekerById(
    session?.user.id!,
    session?.accessToken!
  );
  return <JsInfo _jobSeeker={_jobSeeker} />;
}
