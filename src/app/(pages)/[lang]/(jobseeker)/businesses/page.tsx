import BusinessCmp from '@/app/(pages)/[lang]/(jobseeker)/businesses/BusinessCmp'
import businessService from '@/services/businessService'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Businesses Page",
    description: "Page for all businesses of our Jobnet Company",
};

type Props = {}

export default async function page({ }: Props) {
    const pagination = await businessService.getBusinesses()
    return (
        <BusinessCmp data={pagination}/>
    )
}