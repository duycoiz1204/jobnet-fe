import RecentAppCpn from '@/app/(pages)/[lang]/(jobseeker)/profile/recent-applications/RecentAppCpn';
import { auth } from '@/auth';
import applicationService from '@/services/applicationService';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Recents Applications",
  description: "",
};

type Props = {}

export default async function page({ }: Props) {

  const session = await auth()

  const _applications = await applicationService.getApplications({
    jobSeekerId: session!!.user.id,
    accessToken: session!!.accessToken
  });

  return (
    <RecentAppCpn _applications={_applications} />
  )
}