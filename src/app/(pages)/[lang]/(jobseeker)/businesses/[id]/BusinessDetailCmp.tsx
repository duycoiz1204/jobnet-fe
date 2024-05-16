'use client'
import BusinessInfo from '@/components/BusinessInfo'
import EmptyData from '@/components/EmptyData'
import Pagination from '@/components/Pagination'
import Post from '@/components/Post'
import usePagination from '@/hooks/usePagination'
import postService from '@/services/postService'
import BusinessType from '@/types/business'
import PaginationType from '@/types/pagination'
import PostType from '@/types/post'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { toast } from 'sonner'

type Props = {
    business: BusinessType,
    hiringPostsPagination: PaginationType<PostType>
}

export default function BusinessDetailCmp({
    business, hiringPostsPagination
}: Props) {
    const t = useTranslations()
    const auth = useSession()
    const jobSeekerId = auth.data?.user.id
    const businessId = business.id

    const { pagination, setPagination, scrollIntoView, scrollIntoViewRef } = usePagination(hiringPostsPagination)

    const handlePageChange = (page: number) => {
        void (async () => {
          const pagination = await postService.getPosts({
            page,
            businessId: business.id,
            activeStatus: 'Opening',
            isExpired: false,
          })
          setPagination(pagination)
          scrollIntoView()
        })()
      }

    const hiringPostsElms = hiringPostsPagination.data.map((post) => (
        <Post key={post.id} post={post} navigateTo={post.id} />
      ))
    
    return (
        <div className="pt-20 pb-8 space-y-8">
            <div className="flex justify-center">
                <BusinessInfo
                    className="w-[1200px] py-8"
                    mode="view"
                    business={business}
                />
            </div>

            <div
                ref={scrollIntoViewRef}
                className="w-[1200px] mx-auto space-y-6 mt-8"
            >
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{t('businessDetail.list')}</div>
                    <div className="flex items-center">
                        <div className="text-xl">
                            <AiOutlineFileSearch />
                        </div>
                        <div className="ml-2 font-semibold">
                            {t('businessDetail.total')}:{' '}
                            <span className="text-emerald-500">
                                {t('businessDetail.count', { count: hiringPostsElms.length })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {hiringPostsElms.length ? hiringPostsElms : <EmptyData />}
                </div>
                <Pagination
                    currentPage={hiringPostsPagination.currentPage}
                    totalPages={hiringPostsPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}