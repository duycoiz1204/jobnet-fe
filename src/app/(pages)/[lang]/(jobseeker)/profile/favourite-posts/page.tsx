import FavouritepostsCpn from '@/app/(pages)/[lang]/(jobseeker)/profile/favourite-posts/FavouritepostsCpn'
import { auth } from '@/auth';
import wishlistService from '@/services/wishlistService';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Favourite Jobs",
    description: "Favourite Jobs in our Jobnet Website",
};

type Props = {}

export default async function page({ }: Props) {

    const session = await auth()

    const _wishlist = await wishlistService.getWishlists({ accessToken: session!!.accessToken })

    return (
        <FavouritepostsCpn _wishlist={_wishlist} />
    )
}