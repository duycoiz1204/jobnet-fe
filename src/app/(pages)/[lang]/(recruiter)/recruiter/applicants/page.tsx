import ApplicantManagement from '@/app/(pages)/[lang]/(recruiter)/recruiter/applicants/applicants-cpn'
import { auth } from '@/auth'
import applicationService from '@/services/applicationService'
import dynamic from 'next/dynamic'
import React from 'react'

type Props = {}

export default async function page({ }: Props) {

    const session = await auth()
    const applications = await applicationService.getApplicationsByRecruiterId({accessToken: session!!.accessToken, applicationStatuses: ['Submitted', 'Reviewed']})
    
    return (
        <ApplicantManagement _applications={applications} />
    )
}