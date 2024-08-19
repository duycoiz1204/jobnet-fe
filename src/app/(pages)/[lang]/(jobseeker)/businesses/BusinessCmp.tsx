'use client'
import EmptyData from '@/components/EmptyData'
import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { setLoading } from '@/features/loading/loadingSlice'
import usePagination from '@/hooks/usePagination'
import { useAppDispatch } from '@/hooks/useRedux'
import { Link, usePathname } from '@/navigation'
import businessService from '@/services/businessService'
import BusinessType from '@/types/business'
import PaginationType from '@/types/pagination'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    data: PaginationType<BusinessType>
}

export default function BusinessCmp({ data }: Props) {
    const t = useTranslations()

    const dispatch = useAppDispatch()

    const { pagination, setPagination, scrollIntoView, scrollIntoViewRef } = usePagination(data)
    const [search, setSearch] = useState('')

    const businessesElms = pagination.data.map((business) => (
        <BusinessItem key={business.id} business={business} />
    ))

    const handlePageChange = (page: number) => {
        void (async () => {
            dispatch(setLoading(true))

            try {
                const pagination = await businessService.getBusinesses({ page })
                setPagination(pagination)
                scrollIntoView()
            } catch (err) {
                console.error('An error occured', err)
            } finally {
                dispatch(setLoading(false))
            }
        })()
    }

    const handleSearchBusiness = () => {
        void (async () => {
            dispatch(setLoading(true))

            try {
                const pagination = await businessService.getBusinesses({
                    name: search,
                })
                setPagination(pagination)
                scrollIntoView()
            } catch (err) {
                console.error('An error occured', err)
            } finally {
                dispatch(setLoading(false))
            }
        })()
    }

    return (
        <section className="pt-10 pb-6 overflow-hidden lg:pt-20">
            <div className="grid lg:grid-cols-2 grid-cols-1 h-[330px] items-center justify-between background-overlay-list-bussinesss">
                <div className="flex flex-col justify-center px-3 lg:px-20 gap-y-5">
                    <h2 className="text-3xl font-bold">{t('business.title')}</h2>
                    <h3 className="font-bold">{t('business.subTitle')}</h3>
                    <p className="">{t('business.desc')}</p>
                    <div className="inline-flex items-center lg:max-w-lg lg:px-[10px] py-1 lg:py-2 lg:mt-6 mt-2 bg-white rounded-full">
                        <div className="flex items-center grow">
                            <div className="pl-4 text-lg opacity-50">
                                <FaSearch />
                            </div>
                            <input
                                className="w-full ml-4 bg-transparent outline-none placeholder:text-slate-400"
                                placeholder={t('business.searchBar.inputHolder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            className="mr-1 leading-none rounded-full lg:ml-4 lg:mr-0"
                            variant={"emerald"}
                            onClick={handleSearchBusiness}
                        >
                            {t('business.searchBar.button')}
                        </Button>
                    </div>
                </div>
                <div className="lg:w-[272px] lg:h-[304px] hidden sm:block md:hidden lg:block mx-auto">
                    <img src={'/vite.svg'} className="w-full h-full " />
                </div>
            </div>
            <main ref={scrollIntoViewRef} className="px-3 pt-2 lg:pt-6 lg:px-20">
                <h1 className="p-4 text-xl font-bold text-center uppercase opacity-70">
                    {t('business.topBussinesses')}
                </h1>
                <div className="grid grid-cols-1 pt-5 lg:gap-5 lg:gap-y-5 gap-y-5 lg:grid-cols-3 content">
                    {businessesElms.length ? businessesElms : <EmptyData />}
                </div>
            </main>
            <div className="flex items-center justify-center gap-2 my-10">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    )
}

function BusinessItem({ business }: { business: BusinessType }): JSX.Element {
    const pathname = usePathname()
    return (
        <div className="w-full h-[420px] overflow-hidden bg-cover bg-no-repeat bg-slate-100 rounded-lg relative shadow-md cursor-pointer hover:bg-slate-300 transition-all">
            <div className="w-full h-[210px] rounded-lg">
                <img
                    src={
                        business.backgroundImageId
                            ? businessService.getBusinessBackgroundImage(business.id)
                            : '/business.png'
                    }
                    className="object-top w-full h-full transition duration-300 ease-in-out rounded-tl-lg rounded-tr-lg hover:scale-105"
                />
            </div>
            <div className="w-[90px] h-[90px] mx-auto mb-0 -translate-y-[50%] rounded-md">
                <img
                    src={
                        business.profileImageId
                            ? businessService.getBusinessProfileImage(business.id)
                            : '/business.png'
                    }
                    className="object-cover w-full h-full rounded-md"
                ></img>
            </div>
            <div className="flex flex-col px-3 pb-6 gap-y-3 -mt-3 -translate-y-8 lg:mt-0 lg:px-6">
                <Link
                    href={`${pathname}/${business.id}`}
                    className="inline-block text-lg font-bold truncate hover:underline hover:text-emerald-500"
                >
                    {business.name}
                </Link>
                <div
                    className="w-full h-full p-0 m-0 -translate-y-4 top-5 multiline-ellipsis text-justify overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: business.description }}
                ></div>
            </div>
        </div>
    )
}
