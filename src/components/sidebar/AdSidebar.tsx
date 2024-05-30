'use client'
import Sidebar from '@/components/Sidebar'
import { useTranslations } from 'next-intl'
import React, { useTransition } from 'react'
import { HiArrowSmRight } from 'react-icons/hi'
import {
    FaBriefcase,
    FaCampground,
    FaClipboard,
    FaPaste,
    FaUsers,
    FaHotjar,
    FaArrowsSpin,
    FaCircleCheck,
    FaCircleXmark,
    FaBuildingUser,
    FaEarthAsia,
} from 'react-icons/fa6'
import { FcOvertime } from 'react-icons/fc'
import { GrDocumentTime } from 'react-icons/gr'
import { IoDocumentLock, IoSettings } from 'react-icons/io5'
import { BiSolidCategory } from 'react-icons/bi'
import { MdOutlineAccountCircle, MdOutlineChangeCircle } from 'react-icons/md'
import type { IconType } from 'react-icons'
import useModal from '@/hooks/useModal'
import Modal from '@/components/modal/Modal'
import { BsBoxArrowRight } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/actions/jsAuth'
import { usePathname } from 'next/navigation'

type Props = {}

export default function AdSidebar({ }: Props) {
    const { modal, openModal, closeModal } = useModal()
    const [isPending, startTrasition] = useTransition()
    const pathname = usePathname()
    const t = useTranslations()
    const handleLogout = () => {
        startTrasition(async () => {
            await logoutAction()
            window.location.href = pathname
        })
    }
    return (
        <div className="sticky hidden h-screen lg:flex">
            <Sidebar className="overflow-y-scroll">
                <Sidebar.Logo img="/vite.svg">Logo</Sidebar.Logo>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item to="/admin" end icon={FaBriefcase as IconType}>
                            {t('sidebar.admin.dashboard')}
                        </Sidebar.Item>
                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.managePosts.label')}
                            icon={FaPaste as IconType}
                        >
                            <Sidebar.Item to="/admin/posts/all" icon={FaPaste as IconType}>
                                {t('sidebar.admin.managePosts.collapse.allPosts')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/posts/pending"
                                icon={GrDocumentTime as IconType}
                            >
                                {t('sidebar.admin.managePosts.collapse.pendingPosts')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/posts/opened"
                                icon={GrDocumentTime as IconType}
                            >
                                {t('sidebar.admin.managePosts.collapse.openningPosts')}
                            </Sidebar.Item>
                            <Sidebar.Item to="/admin/posts/expired" icon={FcOvertime as IconType}>
                                {t('sidebar.admin.managePosts.collapse.expriedPosts')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/posts/blocked"
                                icon={IoDocumentLock as IconType}
                            >
                                {t('sidebar.admin.managePosts.collapse.blockedPosts')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>

                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.recruiter.label')}
                            icon={FaUsers as IconType}
                        >
                            <Sidebar.Item to="/admin/recruiters" icon={FaUsers as IconType}>
                                {t('sidebar.admin.recruiter.collapse.allAccounts')}
                            </Sidebar.Item>
                            <Sidebar.Item to="/admin/recruiters/1" icon={FaClipboard as IconType}>
                                {t('sidebar.admin.recruiter.collapse.pendingAccounts')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>

                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.jobSeeker.label')}
                            icon={FaUsers as IconType}
                        >
                            <Sidebar.Item to="/admin/jobseekers" icon={FaUsers as IconType}>
                                {t('sidebar.admin.jobSeeker.collapse.allAccounts')}
                            </Sidebar.Item>
                            <Sidebar.Item to="/admin/jobseekers/1" icon={FaClipboard as IconType}>
                                {t('sidebar.admin.jobSeeker.collapse.pendingAccounts')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.business.label')}
                            icon={FaBuildingUser as IconType}
                        >
                            <Sidebar.Item
                                to="/admin/businesses/all"
                                icon={FaEarthAsia as IconType}
                            >
                                {t('sidebar.admin.business.collapse.allBusinesses')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/businesses/Pending"
                                icon={FaArrowsSpin as IconType}
                            >
                                {t('sidebar.admin.business.collapse.pendingBusinesses')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/businesses/Approved"
                                icon={FaCircleCheck as IconType}
                            >
                                {t('sidebar.admin.business.collapse.aprrovedBusinesses')}
                            </Sidebar.Item>
                            <Sidebar.Item
                                to="/admin/businesses/Rejected"
                                icon={FaCircleXmark as IconType}
                            >
                                {t('sidebar.admin.business.collapse.rejectedBusinesses')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.setting.label')}
                            icon={IoSettings as IconType}
                        >
                            <Sidebar.Item
                                to="/admin/categories"
                                icon={BiSolidCategory as IconType}
                            >
                                {t('sidebar.admin.setting.collapse.category')}
                            </Sidebar.Item>
                            <Sidebar.Item to="professions" icon={FaCampground as IconType}>
                                {t('sidebar.admin.setting.collapse.industry')}
                            </Sidebar.Item>
                            <Sidebar.Item to="levels-benefits" icon={FaHotjar as IconType}>
                                {t('sidebar.admin.setting.collapse.benefitAndLevel')}
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        <Sidebar.Collapse
                            className="cursor-pointer"
                            label={t('sidebar.admin.account.label')}
                            icon={MdOutlineAccountCircle as IconType}
                        >
                            <Sidebar.Item
                                icon={MdOutlineChangeCircle as IconType}
                                className="cursor-pointer"
                            >
                                {t('sidebar.admin.account.collapse.changePassword')}
                            </Sidebar.Item>
                            <div
                                onClick={() => {
                                    openModal('admin-logout')
                                }}
                            >
                                <Sidebar.Item
                                    icon={HiArrowSmRight as IconType}
                                    className="cursor-pointer"
                                >
                                    {t('sidebar.admin.account.collapse.logout')}
                                </Sidebar.Item>
                            </div>
                        </Sidebar.Collapse>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            <Modal
                id="admin-logout"
                show={modal === 'admin-logout'}
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