import ApplicantManagement from '@/app/(pages)/[lang]/(recruiter)/recruiter/(sidebar)/applicants/applicants-cpn'
import { auth } from '@/auth'
import applicationService from '@/services/applicationService'
import React from 'react'

type Props = {}

export default async function page({ }: Props) {

    const session = await auth()
    const applications = await applicationService.getApplicationsByRecruiterId({accessToken: session!!.accessToken})
    
    return (
        <ApplicantManagement _applications={applications}/>
    )
}