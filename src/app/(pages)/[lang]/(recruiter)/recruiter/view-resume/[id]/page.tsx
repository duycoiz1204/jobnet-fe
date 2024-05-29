import ViewResumeRC from '@/app/(pages)/[lang]/(recruiter)/recruiter/view-resume/[id]/view-resumeCpn'
import { auth } from '@/auth'
import recruiterService from '@/services/recruiterService'
import React from 'react'

type Props = {}

export default async function page({ params }: { params: { id: string } }) {

    const session = await auth()
    const recruiter = await recruiterService.getRecruiterById(
        session!!.user.id as string,
        session!!.accessToken
    )


    return (
        <ViewResumeRC _recruiter={recruiter} id={params.id}/>
    )
}