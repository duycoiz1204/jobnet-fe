import BusinessDetailCmp from '@/app/(pages)/[lang]/(jobseeker)/businesses/[id]/BusinessDetailCmp';
import businessService from '@/services/businessService'
import postService from '@/services/postService'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Businesses Details Page",
    description: "Page for details specify business",
};

type Props = {
    params: {
        id: string
    }
}

export default async function page({ params: { id } }: Props) {
    const business = await businessService.getBusinessById(id)
    const hiringPostsPagination = await postService.getPosts({
        businessId: id,
        activeStatus: 'Opening',
        isExpired: false,
      })

    return (
        <BusinessDetailCmp business={business} hiringPostsPagination= {hiringPostsPagination}/>
    )
}