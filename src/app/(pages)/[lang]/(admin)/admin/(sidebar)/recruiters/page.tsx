import ADRecruiterManagement from '@/app/(pages)/[lang]/(admin)/admin/(sidebar)/recruiters/ad-recruiter';
import { auth } from '@/auth';
import recruiterService from '@/services/recruiterService';
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const session = await auth()
  const recruiters = await recruiterService.getRecruiters({
    accessToken: session!!.accessToken,
  });
  return (
    <ADRecruiterManagement _recruiters={recruiters}/>
  )
}