import ResumeCpn from '@/app/(pages)/[lang]/(jobseeker)/profile/resumes/ResumeCpn'
import { auth } from '@/auth';
import resumeService from '@/services/resumeService';
import React from 'react'

type Props = {}

export default async function page({}: Props) {

  const session = await auth()

  const _resumes = await resumeService.getResumesByAuth(
    session!!.accessToken
  );
  return (
    <ResumeCpn _resumes={_resumes}/>
  )
}