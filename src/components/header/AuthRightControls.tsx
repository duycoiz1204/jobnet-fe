'use client'
import Dropdown from "@/components/Dropdown"
import { NavLink } from "@/components/NavLink"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { IconBaseProps, IconType } from "react-icons"
import { BsBoxArrowRight } from "react-icons/bs"
import jobseekersService from '@/services/jobSeekerService'

import {
    FaBell,
    FaRegUser,
    FaArrowRightFromBracket,
    FaGear,
    FaBars,
    FaMagnifyingGlass,
    FaRegAddressCard,
    FaHeadphones,
} from 'react-icons/fa6'
import { useState } from "react"
import Modal from "@/components/modal/Modal"
import useModal from "@/hooks/useModal"
import { UserSessionType } from "@/types/user"

export default function AuthRightControls({
    t,
    auth,
    logout,
}: {
    t: any
    auth: UserSessionType
    logout: () => void
}): JSX.Element {
    function FaAddressCard(props: IconBaseProps): Element {
        throw new Error("Function not implemented.")
    }
    const { modal, openModal, closeModal } = useModal()
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <NavLink
                            href="/jobseeker/notifications"
                            className={navLinkCls}
                        >
                            <FaBell className="w-5 h-5" />
                        </NavLink>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('header.jobSeeker.notifications')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dropdown
                render={
                    <img
                        src={jobseekersService.getJobSeekerProfileImage(auth?.id)}
                        className="w-10 h-10 border rounded-full"
                    />
                }
                type="hover"
                position="bottomRight"
            >
                <Dropdown.Header>
                    <div className="text-lg font-bold text-emerald-400">{auth?.name}</div>
                    <div className="text-sm font-semibold">{auth?.email}</div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item to="jobseeker" icon={FaRegUser as IconType}>
                    {t('header.jobSeeker.user.dropdown.account')}
                </Dropdown.Item>
                <Dropdown.Item to="jobseeker/settings" icon={FaGear as IconType}>
                    {t('header.jobSeeker.user.dropdown.settings')}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item icon={FaArrowRightFromBracket as IconType}>
                    <div
                        className="w-full cursor-pointer"
                        onClick={() => openModal('logout-modal')}
                    >
                        {t('header.jobSeeker.user.dropdown.logout')}
                    </div>{' '}
                </Dropdown.Item>
            </Dropdown>

            <Dropdown
                className="h-12 px-2 md:hidden"
                render={<FaBars className="w-5 h-5" />}
                type="hover"
            >
                <Dropdown.Header>
                    <div className="text-lg font-bold text-emerald-400">
                        {t('header.jobSeeker.classification')}
                    </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item to="posts" icon={FaMagnifyingGlass as IconType}>
                    {t('header.jobSeeker.search.label')}
                </Dropdown.Item>
                <Dropdown.Item icon={FaRegAddressCard as IconType}>
                    {t('header.jobSeeker.profileAndCV.label')}
                </Dropdown.Item>
                <Dropdown.Item icon={FaAddressCard as unknown as IconType}>
                    {t('header.jobSeeker.business.label')}
                </Dropdown.Item>
                <Dropdown.Item icon={FaHeadphones as IconType}>
                    {/* {t('header.jobSeeker.contacct')}  */}
                    Chưa có language
                </Dropdown.Item>
            </Dropdown>

            {/* Logout */}
            <Modal
                id="logout-modal"
                show={modal === 'logout-modal'}
                size="md"
                popup
                onClose={closeModal}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <BsBoxArrowRight className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {t('header.jobSeeker.modal.logout.title')}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => {
                                logout()
                                closeModal()
                            }}>
                                {t('header.jobSeeker.modal.logout.button.logout')}
                            </Button>
                            <Button variant="red" onClick={closeModal}>
                                {t('header.jobSeeker.modal.logout.button.cancel')}
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

const navLinkCls = ({ isActive }: { isActive: boolean }) => {
    return `flex p-2 transition hover:text-emerald-500 ${isActive ? 'text-emerald-500' : ''
        }`
}
