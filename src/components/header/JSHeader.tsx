'use client'
import {
  FaGear,
  FaHeart,
  FaSuitcase,
  FaListCheck,
  FaFile,
  FaStar,
  FaClipboard,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { FaSearch } from 'react-icons/fa'

import LanguageSelector from '@/components/LanguageSelector'
import { Link, usePathname } from '@/navigation'
import { NavLink } from '@/components/NavLink'
import Dropdown from '@/components/Dropdown'
import { Button } from '@/components/ui/button'
import AuthRightControls from '@/components/header/AuthRightControls'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useTransition } from 'react'
import { logoutAction } from '@/actions/jsAuth'

interface JSHeaderProps{
}

export default function JSHeader({}: JSHeaderProps): JSX.Element {

  const t = useTranslations()
  const [isPending, startTrasition] = useTransition()
  const initSession = useSession().data?.user
  const user = initSession
  const pathname = usePathname()

  const handleLogout = () => {
    startTrasition(async () => {
      await logoutAction()
      window.location.href = pathname
    })
  }

  return (
    <header className="fixed z-50 flex items-center justify-between w-full h-20 px-4 bg-white shadow sm:px-8 hover:shadow-lg">
      <div className="flex items-center gap-10">
        <NavLink href="/" className="flex items-center">
          <img src={'/vite.svg'} className="h-10" />
          <h2 className="ml-2 text-2xl font-bold md:ml-4">Brand</h2>
        </NavLink>

        <nav className="items-center hidden font-semibold md:gap-2 lg:gap-8 md:flex">
          <Dropdown
            width="w-[300px]"
            render={
              <NavLink href="/posts" className={navLinkCls}>
                {t('header.jobSeeker.search.label')}
              </NavLink>
            }
            type="hover"
          >
            <Dropdown.Item to="/posts" icon={FaSearch as IconType} >
              {t('header.jobSeeker.search.dropdown.searchJobs')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item to="/profile/recent-applications" icon={FaGear as IconType}>
              {t('header.jobSeeker.search.dropdown.appliedJobs')}
            </Dropdown.Item>
            <Dropdown.Item
              to="/profile/favourite-posts"
              icon={FaHeart as IconType}
            >
              {t('header.jobSeeker.search.dropdown.bookmarkedJobs')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item to="" icon={FaSuitcase as IconType}>
              {t('header.jobSeeker.search.dropdown.suitableJobs')}
            </Dropdown.Item>
          </Dropdown>

          <Dropdown
            render={
              <NavLink href="#" className="transition hover:text-emerald-500">
                {t('header.jobSeeker.profileAndCV.label')}
              </NavLink>
            }
            type="hover"
          >
            <Dropdown.Item to="" icon={FaListCheck as IconType}>
              {t('header.jobSeeker.profileAndCV.dropdown.CVs')}
            </Dropdown.Item>
            <Dropdown.Item to="" icon={FaFile as IconType}>
              {t('header.jobSeeker.profileAndCV.dropdown.coverLetters')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              to="jobseeker/favorite-jobs"
              icon={FaClipboard as IconType}
            >
              {t('header.jobSeeker.profileAndCV.dropdown.cvTemplate')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={FaStar as IconType}>
              {t('header.jobSeeker.profileAndCV.dropdown.topCVProfile')}
            </Dropdown.Item>
          </Dropdown>

          <Dropdown
            render={
              <NavLink href="/businesses" className={navLinkCls}>
                {t('header.jobSeeker.business.label')}
              </NavLink>
            }
            type="hover"
          >
            <Dropdown.Item to="businesses" icon={FaListCheck as IconType}>
              {t('header.jobSeeker.business.dropdown.businessList')}
            </Dropdown.Item>
            <Dropdown.Item to="" icon={FaStar as IconType}>
              {t('header.jobSeeker.business.dropdown.topBusinesses')}
            </Dropdown.Item>
          </Dropdown>

          <NavLink href="#" className="transition hover:text-emerald-500">
            {t('header.jobSeeker.contact')}
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <LanguageSelector />
        {user ? (
          <AuthRightControls t={t} logout={handleLogout} auth={user} />
        ) : (
          <NoAuthRightControls t={t} />
        )}{' '}
        {!user && (
          <Link
            href={'/recruiter'}
            className="px-4 py-2 font-semibold text-white transition-all rounded-lg bg-slate-400 hover:bg-slate-500"
          >
            {t('header.jobSeeker.unRegister.recruiter')}
          </Link>
        )}
      </div>
    </header>
  )
}



function NoAuthRightControls({
  t,
}: {
  t: any
}): JSX.Element {
  let callBackUrl = usePathname()

  const encodedCallbackUrl = encodeURIComponent(callBackUrl)
  return (
    <>
      <Link href={`/signin?callbackUrl=${encodedCallbackUrl}`}>
        <Button
          variant="empty"
          className="border border-emerald-500 text-emerald-500 hover:bg-slate-100"
        >
          {t('header.jobSeeker.unRegister.login')}
        </Button>
      </Link>
      <Link href="/signup">
        <Button>
          {t('header.jobSeeker.unRegister.register')}
        </Button>
      </Link>
    </>
  )
}

const navLinkCls = ({ isActive }: { isActive: boolean }) => {
  return `flex p-2 transition hover:text-emerald-500 ${isActive ? 'text-emerald-500' : ''
    }`
}
