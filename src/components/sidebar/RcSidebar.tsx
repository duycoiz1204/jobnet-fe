'use client'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import {
    FaBriefcase,
    FaBuilding,
    FaCampground,
    FaClipboard,
    FaClipboardUser,
    FaPaste,
    FaUser,
    FaUsers,
} from 'react-icons/fa6'
import { HiArrowSmRight } from 'react-icons/hi'

import type { IconType } from 'react-icons'
import { useTranslations } from 'next-intl'

type Props = {}

export default function RcSidebar({ }: Props) {
    const t = useTranslations()

    return (
        <div
            className="sticky hidden top-20 lg:flex"
            style={{ height: 'calc(100vh - 80px)' }}
        >
            <Sidebar>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item to="." end icon={FaBriefcase as IconType}>
                            {t('sidebar.recruiter.dashboard')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/recruiter/posts" end icon={FaPaste as IconType}>
                            {t('sidebar.recruiter.managePosts')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/recruiter/campaigns" icon={FaCampground as IconType}>
                            {t('sidebar.recruiter.camping')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/recruiter/applicants" icon={FaUsers as IconType}>
                            {t('sidebar.recruiter.candidate')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/recruiter/interviews" icon={FaClipboard as IconType}>
                            {t('sidebar.recruiter.interview')}
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        <Sidebar.Collapse
                            label={t('sidebar.recruiter.account.label')}
                            icon={FaUser as IconType}
                        >
                            <Sidebar.Item icon={FaClipboardUser as IconType} to="/recruiter/profile">
                                {t('sidebar.recruiter.account.collapse.accountInfo')}
                            </Sidebar.Item>
                            <Sidebar.Item icon={FaBuilding as IconType} to="/recruiter/business">
                                {t('sidebar.recruiter.account.collapse.businessInfo')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                        <Sidebar.Item icon={HiArrowSmRight as IconType}>
                            {t('sidebar.recruiter.logout')}
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>

    )
}