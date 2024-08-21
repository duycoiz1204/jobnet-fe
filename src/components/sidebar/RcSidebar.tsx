'use client'
import Sidebar from '@/components/Sidebar'
import React, { useTransition } from 'react'
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
import { logoutAction } from '@/actions/jsAuth'
import { usePathname } from '@/navigation'
import Modal from '@/components/modal/Modal'
import { BsBoxArrowRight } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import useModal from '@/hooks/useModal'

type Props = {}

export default function RcSidebar({ }: Props) {
    const [isPending, startTrasition] = useTransition()
    const t = useTranslations()
    const pathname = usePathname()
    const { modal, openModal, closeModal } = useModal()
    const handleLogout = () => {
        startTrasition(async () => {
            await logoutAction()
            window.location.href = pathname
        })
    }
    return (
        <div
            className="sticky hidden top-20 lg:flex z-10"
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
                            className='hover:cursor-pointer'
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
                        <Sidebar.Item className='hover:cursor-pointer' onClick={() => openModal('recruiter-logout-modal')} icon={HiArrowSmRight as IconType}>
                            {t('sidebar.recruiter.logout')}
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            <Modal
                id="recruiter-logout-modal"
                show={modal === 'recruiter-logout-modal'}
                size="md"
                popup
                onClose={closeModal}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <BsBoxArrowRight className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {t('header.recruiter.modal.logout.title')}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button onClick={handleLogout}>
                                {t('header.recruiter.modal.logout.button.logout')}
                            </Button>
                            <Button variant="red" onClick={closeModal}>
                                {t('header.recruiter.modal.logout.button.cancel')}
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>

    )
}