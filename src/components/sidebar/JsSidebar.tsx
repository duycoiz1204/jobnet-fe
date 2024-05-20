'use client'
import React from 'react'
import Sidebar from '@/components/Sidebar';
import { IconType } from 'react-icons';
import {
    FaAddressCard,
    FaCheck,
    FaIdCard,
    FaPalette,
    FaPenToSquare,
    FaRegBell,
    FaSliders,
    FaUserCheck,
    FaUserTie,
    FaUsersViewfinder,
} from 'react-icons/fa6'
import { useTranslations } from 'next-intl';
type Props = {}

export default function JsSidebar({ }: Props) {
    const t = useTranslations()
    return (
        <div
            className="sticky hidden top-20 lg:flex"
            style={{ height: 'calc(100vh - 80px)' }}
        >
            <Sidebar>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item to="/profile/dashboard" end icon={FaPalette as IconType}>
                            {t('sidebar.jobSeeker.manageProfile')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/profile/info" icon={FaAddressCard as IconType}>
                            {t('sidebar.jobSeeker.profile')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/profile/resumes" icon={FaIdCard as IconType}>
                            {t('sidebar.jobSeeker.myCV')}
                        </Sidebar.Item>
                        <Sidebar.Item
                            to="/profile/favorite-posts"
                            icon={FaPenToSquare as IconType}
                        >
                            {t('sidebar.jobSeeker.favoriteJobs')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/profile/recent-applications" icon={FaCheck as IconType}>
                            {t('sidebar.jobSeeker.appliedJobs')}
                        </Sidebar.Item>
                        <Sidebar.Collapse
                            label={t('sidebar.jobSeeker.recruiter.label')}
                            icon={FaUserTie as IconType}
                        >
                            <Sidebar.Item
                                to="/profile/profile-views"
                                icon={FaUsersViewfinder as IconType}
                            >
                                {t('sidebar.jobSeeker.recruiter.collapse.profileViews')}
                            </Sidebar.Item>
                            <Sidebar.Item to="/profile/following" icon={FaUserCheck as IconType}>
                                {t('sidebar.jobSeeker.recruiter.collapse.following')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                        <Sidebar.Item to="/profile/notifications" icon={FaRegBell as IconType}>
                            {t('sidebar.jobSeeker.notifications')}
                        </Sidebar.Item>
                        <Sidebar.Item to="/profile/settings" icon={FaSliders as IconType}>
                            {t('sidebar.jobSeeker.settings')}
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
}