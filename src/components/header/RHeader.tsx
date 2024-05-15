import { Link, NavLink } from 'react-router-dom'
import { FaBell, FaEnvelope } from 'react-icons/fa'
import { IconType } from 'react-icons'

import vite from '/vite.svg'
import Button from '../Button'
import { Tooltip } from 'flowbite-react'
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
import { useDispatch, useSelector } from 'react-redux'
import { BsBoxArrowRight } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

import recruiterService from '../../services/recruiterService'

import Dropdown from '../Dropdown'
import LanguageSelector from '../LanguageSelector'
import AuthType from '../../types/auth'

import { authActions } from '../../features/auth/authSlice'
import { RootState } from '../../app/store'
import useModal from '../../hooks/useModal'
import Modal from '../Modal'

export default function RHeadder(): JSX.Element {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  const { t } = useTranslation()

  const handleLogout = () => {
    dispatch(authActions.clearAuth())
  }
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-4 bg-white shadow lg:px-8 hover:shadow-lg">
        <div>
          <div className="flex items-center">
            <Link to="." className="flex items-center">
              <img src={vite} className="h-10" />
              <h2 className="hidden ml-4 text-2xl font-bold lg:inline-block">
                Brand
              </h2>
            </Link>
            <nav className="items-center hidden ml-6 font-semibold lg:ml-8 md:gap-2 lg:gap-6 md:flex">
              <Dropdown
                className="p-2"
                render={
                  <NavLink to="jobseekers" className={recruiterNavLink}>
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
                  <NavLink to="posts" className={recruiterNavLink}>
                    {t('header.recruiter.posts.label')}
                  </NavLink>
                }
                type="hover"
                position="bottomLeft"
              >
                <Dropdown.Item to="posts" icon={FaBars as IconType}>
                  {t('header.recruiter.posts.dropdown.managementPosts')}
                </Dropdown.Item>
                <Dropdown.Item
                  to="../../recruiter/posts/new"
                  icon={FaFile as IconType}
                >
                  {t('header.recruiter.posts.dropdown.createPost')}
                </Dropdown.Item>
              </Dropdown>
              <Dropdown
                className="p-2"
                render={
                  <NavLink to="campaigns" className={recruiterNavLink}>
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
          {auth.user ? (
            <RecruiterRegister
              translate={t}
              logout={handleLogout}
              auth={auth}
            />
          ) : (
            <RecruiterUnregister translate={t} />
          )}{' '}
          {!auth.user && (
            <Link
              to={'../'}
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
  translate,
}: {
  auth: AuthType
  logout: () => void
  translate: TFunction<'translation', undefined>
}) => {
  const { modal, openModal, closeModal } = useModal()

  return (
    <>
      <Tooltip content={translate('header.recruiter.email')} style="light">
        <NavLink to="/chat" className={recruiterNavLink}>
          <FaEnvelope className="w-5 h-5" />
        </NavLink>
      </Tooltip>

      <Tooltip
        content={translate('header.recruiter.notifications')}
        style="light"
      >
        <NavLink to="/notifications" className={recruiterNavLink}>
          <FaBell className="w-5 h-5" />
        </NavLink>
      </Tooltip>
      {auth.user && (
        <Link to={'../../recruiter/posts/new'} className="block">
          <Button size="sm">
            {' '}
            <FaFile className="mr-2" />
            {translate('header.recruiter.button')}
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
              recruiterService.getRecruiterProfileImage(auth.user?.id) ||
              `https://www.w3schools.com/howto/img_avatar2.png`
            }
          />
        }
        type="hover"
        position="bottomRight"
      >
        <Dropdown.Header>
          <div className="text-lg font-bold text-emerald-400">
            {auth.user?.name}
          </div>
          <div className="text-sm font-semibold">{auth.user?.email}</div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item to="profile" icon={FaRegUser as IconType}>
          {translate('header.recruiter.accountPopup.account')}
        </Dropdown.Item>
        <Dropdown.Item to="business" icon={FaBusinessTime as IconType}>
          {translate('header.recruiter.accountPopup.businessInfo')}
        </Dropdown.Item>
        <Dropdown.Item to="jobseeker/settings" icon={FaGear as IconType}>
          {translate('header.recruiter.accountPopup.setting')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={FaArrowRightFromBracket as IconType}>
          <div
            className="w-full cursor-pointer"
            onClick={() => openModal('recruiter-logout-modal')}
          >
            {translate('header.recruiter.accountPopup.logout')}
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
              {translate('header.recruiter.modal.logout.title')}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="emerald" onClick={logout}>
                {translate('header.recruiter.modal.logout.button.logout')}
              </Button>
              <Button color="red" onClick={closeModal}>
                {translate('header.recruiter.modal.logout.button.cancel')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function RecruiterUnregister({
  translate,
}: {
  translate: TFunction<'translation', undefined>
}): JSX.Element {
  return (
    <>
      <Link to="signin">
        <Button
          color="empty"
          className="border border-emerald-500 text-emerald-500 hover:bg-slate-100"
          size="md"
        >
          {translate('header.recruiter.unRegister.login')}
        </Button>
      </Link>
      <Link to="signup">
        <Button size="md">
          {translate('header.recruiter.unRegister.register')}
        </Button>
      </Link>
    </>
  )
}

const recruiterNavLink = ({ isActive }: { isActive: boolean }) =>
  `transition-all hover:text-emerald-500 relative ${
    isActive ? 'text-emerald-500' : ''
  }`
