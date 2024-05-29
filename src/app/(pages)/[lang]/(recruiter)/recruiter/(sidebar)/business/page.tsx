import MyBusiness from '@/app/(pages)/[lang]/(recruiter)/recruiter/(sidebar)/business/business-info'
import { auth } from '@/auth'
import { redirect } from '@/navigation'
import businessService from '@/services/businessService'
import recruiterService from '@/services/recruiterService'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'My Business',
    description: 'My Business Page for Recruiter in our Jobnet Website',
  };

type Props = {}

export default async function page({ }: Props) {
    const session = await auth()
    const recruiter = await recruiterService.getRecruiterById(session!!.user.id, session!!.accessToken)
    if (!recruiter.business) {
        return redirect('/recruiter/business/new')
    }
    const business = await businessService.getBusinessById(recruiter.business.id)
    console.log(business);
    
    return (
        <MyBusiness _business={business}/>
    )
}