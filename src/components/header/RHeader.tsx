'use client'
import { FaBell, FaEnvelope } from 'react-icons/fa'
import { IconType } from 'react-icons'

import {
  FaArrowRightFromBracket,
  FaBars,
  FaBusinessTime,
  FaFile,
  FaGear,
  FaHeart,
  FaRegUser,
  FaUser,
} from 'react-icons/fa6'
import { BsBoxArrowRight } from 'react-icons/bs'

import recruiterService from '../../services/recruiterService'

import Dropdown from '../Dropdown'
import LanguageSelector from '../LanguageSelector'

import useModal from '../../hooks/useModal'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/navigation'
import { NavLink } from '@/components/NavLink'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import Modal from '@/components/modal/Modal'
import { logoutAction } from '@/actions/jsAuth'
import { useTransition } from 'react'

export default function RHeadder(): JSX.Element {
  const [isPending, startTrasition] = useTransition()
  let session = useSession()
  if (session && session.data?.user.role != "Recruiter"){
    session.data = null
  }
  const t = useTranslations()
  const pathname = usePathname()

  const handleLogout = () => {
    startTrasition(async () => {
      await logoutAction()
      window.location.href = pathname
    })
  }
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-4 bg-white shadow lg:px-8 hover:shadow-lg">
        <div>
          <div className="flex items-center">
            <Link href="." className="flex items-center">
              <img src={'/vite.svg'} className="h-10" />
              <h2 className="hidden ml-4 text-2xl font-bold lg:inline-block">
                Brand
              </h2>
            </Link>
            <nav className="items-center hidden ml-6 font-semibold lg:ml-8 md:gap-2 lg:gap-6 md:flex">
              <Dropdown
                className="p-2"
                render={
                  <NavLink href="/jobseekers" className={recruiterNavLink}>
                    {t('header.recruiter.candidate.label')}
                  </NavLink>
                }
                type="hover"
                position="bottomLeft"
              >
                <Dropdown.Item to="jobseekers" icon={FaBars as IconType}>
                  {t('header.recruiter.candidate.dropdown.managementCandidate')}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item to="jobseekers" icon={FaUser as IconType}>
                  {t('header.recruiter.candidate.dropdown.rightCandidate')}
                </Dropdown.Item>
                <Dropdown.Item to="jobseeker" icon={FaHeart as IconType}>
                  {t('header.recruiter.candidate.dropdown.appliedCandiate')}
                </Dropdown.Item>
              </Dropdown>
              <Dropdown
                className="p-2"
                render={
                  <NavLink href="/recruiter/posts" className={recruiterNavLink}>
                    {t('header.recruiter.posts.label')}
                  </NavLink>
                }
                type="hover"
                position="bottomLeft"
              >
                <Dropdown.Item to="/recruiter/posts" icon={FaBars as IconType}>
                  {t('header.recruiter.posts.dropdown.managementPosts')}
                </Dropdown.Item>
                <Dropdown.Item
                  to="/recruiter/posts/new"
                  icon={FaFile as IconType}
                >
                  {t('header.recruiter.posts.dropdown.createPost')}
                </Dropdown.Item>
              </Dropdown>
              <Dropdown
                className="p-2"
                render={
                  <NavLink href="campaigns" className={recruiterNavLink}>
                    {t('header.recruiter.cv.label')}
                  </NavLink>
                }
                type="hover"
                position="bottomLeft"
              >
                <Dropdown.Item to="campaigns" icon={FaBars as IconType}>
                  {t('header.recruiter.cv.dropdown.rightCV')}
                </Dropdown.Item>
              </Dropdown>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <LanguageSelector />
          {session?.data?.user ? (
            <RecruiterRegister
              logout={handleLogout}
              auth={session.data}
            />
          ) : (
            <RecruiterUnregister />
          )}{' '}
          {!session?.data?.user && (
            <Link
              href={'../'}
              className="px-4 py-2 font-semibold text-white transition-all rounded-lg bg-slate-400 hover:bg-slate-500"
            >
              {t('header.recruiter.unRegister.candidate')}
            </Link>
          )}
        </div>
      </header>
    </>
  )
}

const RecruiterRegister = ({
  auth,
  logout,
}: {
  auth: Session | undefined
  logout: () => void
}) => {
  const { modal, openModal, closeModal } = useModal()
  const t = useTranslations()
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink href="/chat" className={recruiterNavLink}>
              <FaEnvelope className="w-5 h-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('header.recruiter.email')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink href="/notifications" className={recruiterNavLink}>
              <FaBell className="w-5 h-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('header.recruiter.notifications')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      {auth?.user && (
        <Link href={'../../recruiter/posts/new'} className="block">
          <Button size="sm">
            {' '}
            <FaFile className="mr-2" />
            {t('header.recruiter.button')}
          </Button>
        </Link>
      )}
      {/* <Button color="empty" size="sm" className="text-white bg-cyan-500">
          <FaHeadset className="mr-2" />
          Hỗ trợ
        </Button> */}

      <Dropdown
        className="p-2 cursor-pointer"
        render={
          <img
            className="w-10 h-10 rounded-full hover:border-2 border-slate-200"
            src={
              recruiterService.getRecruiterProfileImage(auth?.user?.id) ||
              `https://www.w3schools.com/howto/img_avatar2.png`
            }
          />
        }
        type="hover"
        position="bottomRight"
      >
        <Dropdown.Header>
          <div className="text-lg font-bold text-emerald-400">
            {auth?.user?.name}
          </div>
          <div className="text-sm font-semibold">{auth?.user?.email}</div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item to="/recruiter/profile" icon={FaRegUser as IconType}>
          {t('header.recruiter.accountPopup.account')}
        </Dropdown.Item>
        <Dropdown.Item to="/recruiter/business" icon={FaBusinessTime as IconType}>
          {t('header.recruiter.accountPopup.businessInfo')}
        </Dropdown.Item>
        <Dropdown.Item to="jobseeker/settings" icon={FaGear as IconType}>
          {t('header.recruiter.accountPopup.setting')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={FaArrowRightFromBracket as IconType}>
          <div
            className="w-full cursor-pointer"
            onClick={() => openModal('recruiter-logout-modal')}
          >
            {t('header.recruiter.accountPopup.logout')}
          </div>{' '}
        </Dropdown.Item>
      </Dropdown>

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
              <Button onClick={logout}>
                {t('header.recruiter.modal.logout.button.logout')}
              </Button>
              <Button variant="red" onClick={closeModal}>
                {t('header.recruiter.modal.logout.button.cancel')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function RecruiterUnregister({
}: {
  }): JSX.Element {
  const t = useTranslations()
  const pathname = usePathname()
  return (
    <>
      <Link href={`${pathname}/signin`}>
        <Button
          variant="empty"
          className="border border-emerald-500 text-emerald-500 hover:bg-slate-100"
          size="sm"
        >
          {t('header.recruiter.unRegister.login')}
        </Button>
      </Link>
      <Link href={`${pathname}/signup`}>
        <Button size="sm">
          {t('header.recruiter.unRegister.register')}
        </Button>
      </Link>
    </>
  )
}

const recruiterNavLink = ({ isActive }: { isActive: boolean }) =>
  `transition-all hover:text-emerald-500 relative ${isActive ? 'text-emerald-500' : ''
  }`
