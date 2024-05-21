import ViewResumeJS from '@/app/(pages)/[lang]/(common)/view-resume/[id]/ViewResumeJS'
import { auth } from '@/auth'
import evaluationService from '@/services/evaluationService'
import resumeService from '@/services/resumeService'
import React from 'react'


export default async function page({ params }: { params: { id: string }}) {

    const session = await auth()

    const data = await resumeService.getResumesById(params.id, session!!.accessToken)
    const file = await resumeService.getResumeFile(params.id, session!!.accessToken)
    const res = await evaluationService.getEvaluationByAuth(params.id, session!!.accessToken)
    const url = URL.createObjectURL(file)
    return (
        <ViewResumeJS _resume={data} _file={url} _comments={res.map((item) => item)}/>
    )
}