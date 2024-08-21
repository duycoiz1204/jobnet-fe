import Campaign from '@/app/(pages)/[lang]/(recruiter)/recruiter/campaigns/campaign-cpn'
import { auth } from '@/auth'
import resumeService from '@/services/resumeService'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
    const session = await auth()
    const resumes = await resumeService.getResumesByAuth(session!!.accessToken)
  return (
    <Campaign _resumes={resumes}/>
  )
}