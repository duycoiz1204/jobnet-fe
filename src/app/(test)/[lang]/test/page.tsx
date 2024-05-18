import { auth } from '@/auth'
import applicationService from '@/services/applicationService';
import React from 'react'

type Props = {}

export default async function page({ }: Props) {
    console.log("Come to Test page");
    
    const session = await auth()
    // const _isSubmitted = (session?.user.role) ? await applicationService.isSubmitted(params.id, session.accessToken, session.refreshToken) : true
    // console.log("Finally data", _isSubmitted);
    console.log("Session From PostDetails: ", session);
    return (
        <div>aa</div>
    )
}