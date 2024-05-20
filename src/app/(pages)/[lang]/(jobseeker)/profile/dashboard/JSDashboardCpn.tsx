'use client'
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/navigation';
import jobSeekerService from '@/services/jobSeekerService';
import ApplicationType from '@/types/application';
import JobSeekerType from '@/types/jobSeeker';
import PaginationType from '@/types/pagination';
import ResumeType from '@/types/resume';
import { CircleAlert, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react'

interface Props {
    jobSeeker: JobSeekerType
    applications: PaginationType<ApplicationType>
    resumes: Array<ResumeType>
}

export default function JSDashboardCpn({
    jobSeeker, applications, resumes
}: Props) {
    const router = useRouter();
    const t = useTranslations();

    // Job Suggessted
    const boxShadow = {
        boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
    };
    return (
        <div className="bg-gray-100 dashboard pt-10">
            <div className="flex flex-col w-full gap-3 mx-auto overflow-x-hidden lg:flex-row lg:gap-1 drop-shadow-lg">
                <div className="w-full lg:w-2/6 bg-slate-50 h-fit">
                    <div className="flex items-center justify-center p-3 bg-purple-500 gap-x-16">
                        <img
                            src={
                                jobSeeker.profileImageId
                                    ? jobSeekerService.getJobSeekerProfileImage(jobSeeker.id)
                                    : 'https://www.w3schools.com/howto/img_avatar2.png'
                            }
                            alt="img infor"
                            className="w-20 border-2 border-white rounded-md place-self-start"
                        />
                        <Link
                            href="/profile/info"
                            className="p-2 text-center text-white rounded w-28 bg-emerald-500 hover:bg-emerald-600"
                        >
                            {t('jobseeker.dashboard.leftColumn.row1.button')}
                        </Link>
                    </div>
                    <table className="ml-3 text-left table-auto">
                        <tbody>
                            <tr>
                                <th className="p-2">
                                    {t('jobseeker.dashboard.leftColumn.row2.contact')}
                                </th>
                                <td className="p-2">{jobSeeker?.name}</td>
                            </tr>
                            <tr>
                                <th className="p-2">
                                    {t('jobseeker.dashboard.leftColumn.row2.phone')}
                                </th>
                                <td className="p-2">{jobSeeker?.phone}</td>
                            </tr>
                            <tr>
                                <th className="p-2">
                                    {t('jobseeker.dashboard.leftColumn.row2.email')}
                                </th>
                                <td className="p-2 break-all">{jobSeeker?.email}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex items-center justify-end mr-2 cursor-pointer">
                        <Pencil />
                        <Link href="/profile/info" className="italic text-blue-500 underline-offset-2">
                            {t('jobseeker.dashboard.leftColumn.row2.tag')}
                        </Link>
                    </div>
                    <hr className="mt-5 border-1 border-slate-400" />

                    <div className="flex flex-col items-center justify-center">
                        <h1>
                            <b className="text-2xl">
                                {t('jobseeker.dashboard.leftColumn.row3')}
                            </b>
                        </h1>

                        <div
                            data-progress="70"
                            className="flex items-center justify-center rounded-full w-44 h-44"
                            style={{
                                backgroundImage: 'conic-gradient(#1ac880 36deg, #f0f9ff 0deg)',
                            }}
                        >
                            <img
                                src="/vite.svg"
                                alt="img infor"
                                className="w-32 border-2 border-white rounded-full outline outline-8 outline-white borer bg-blue-50"
                            />
                        </div>
                    </div>
                    <hr className="mt-5 border-1 border-slate-400" />
                    <h1 className="mt-3 mb-3 ml-1 text-sm" id="X">
                        <b>{t('jobseeker.dashboard.leftColumn.row4.title')}</b>
                    </h1>
                    <div className="flex flex-col ml-4 gap-y-6 step">
                        <div className="relative flex items-center w-full step-1">
                            <p className="text-blue-500 text-md lg:text-sm">
                                {t('jobseeker.dashboard.leftColumn.row4.setupProfile')}
                            </p>
                            <Button
                                className="absolute right-2"
                                onClick={() => router.push('./profile')}
                            >
                                {t('jobseeker.dashboard.leftColumn.row4.button')}
                            </Button>
                        </div>
                        {!jobSeeker.profileImageId && (
                            <span>
                                <hr className="border-1 border-slate-400" />
                                <div className="relative flex items-center w-full mt-5 step-2 gap-x-18">
                                    <p className="text-blue-500 text-md lg:text-sm">
                                        Upload your image
                                    </p>
                                    <Button className="absolute right-2">Get started</Button>
                                </div>
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col p-4 mt-5 gap-y-2 update-profile bg-slate-300">
                        <b>{t('jobseeker.dashboard.leftColumn.row5.title')}</b>
                        <p className="">
                            {t('jobseeker.dashboard.leftColumn.row5.subTitle')}
                        </p>
                        <Button
                            className="w-full bg-amber-500"
                            onClick={() => router.push('./profile')}
                        >
                            {t('jobseeker.dashboard.leftColumn.row5.button')}
                        </Button>
                    </div>
                    {resumes.length == 0 && (
                        <div className="flex flex-col col-span-2 p-4 mt-2 update-profile bg-slate-50 gap-y-2">
                            <b className="text-red-500">
                                {t('jobseeker.dashboard.leftColumn.row6.title')}
                            </b>
                            <div className="flex items-center content gap-x-4">
                                <p className="">
                                    {t('jobseeker.dashboard.leftColumn.row6.subTitle')}
                                </p>
                                <CircleAlert className="text-red-500 text-md" />
                            </div>
                            <Button
                                className="w-full bg-red-500"
                                onClick={() => router.push('./resumes')}
                            >
                                {t('jobseeker.dashboard.leftColumn.row6.button')}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col lg:w-4/6 w-full  overflow-x-hidden lg:h-[1100px] h-fit">
                    <div className="grid justify-center w-full grid-cols-3 ml-3 text-center xl:grid-cols-3 lg:grid-cols-4 row gap-x-5 gap-y-3">
                        <div
                            className="flex flex-col employer-view bg-slate-50 xl:col-span-1 lg:col-span-2 drop-shadow-lg h-fit gap-y-3 hover:cursor-pointer"
                            style={boxShadow}
                        >
                            <div className="p-2 text-white break-words bg-purple-600 header-tag">
                                {t('jobseeker.dashboard.rightColumn.row1.viewProfile.title')}
                            </div>
                            <div className="p-4 text-5xl quality text-violet-600">0</div>
                            <div className="pb-4 text-sm break-words details text-violet-600">
                                <b>
                                    {t('jobseeker.dashboard.rightColumn.row1.viewProfile.desc')}
                                </b>
                            </div>
                        </div>

                        <div
                            className="flex flex-col employer-view lg:col-span-2 xl:col-span-1 bg-slate-50 drop-shadow-lg h-fit gap-y-3 hover:cursor-pointer"
                            style={boxShadow}
                            onClick={() => router.push('./application-recents')}
                        >
                            <div className="p-2 text-white break-words bg-purple-600 header-tag">
                                {t('jobseeker.dashboard.rightColumn.row1.application.title')}
                            </div>
                            <div className="p-4 text-5xl quality text-violet-600">
                                {applications.data.length}
                            </div>
                            <div className="pb-4 text-sm break-words details text-violet-600">
                                <b>
                                    {t('jobseeker.dashboard.rightColumn.row1.application.desc')}
                                </b>
                            </div>
                        </div>
                        <div
                            className="flex flex-col lg:col-span-2 employer-view xl:col-span-1 bg-slate-50 drop-shadow-lg h-fit gap-y-3 hover:cursor-pointer"
                            style={boxShadow}
                        >
                            <div className="p-2 text-white break-words bg-purple-600 header-tag">
                                {t('jobseeker.dashboard.rightColumn.row1.jobNotify.title')}
                            </div>
                            <div className="p-4 text-5xl quality text-violet-600">0</div>
                            <div className="pb-4 text-sm break-words details text-violet-600">
                                <b>
                                    {t('jobseeker.dashboard.rightColumn.row1.jobNotify.desc')}
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}