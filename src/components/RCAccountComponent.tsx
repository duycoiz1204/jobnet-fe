'use client';

import { useSession } from 'next-auth/react';

import JobSeekerType from '@/types/jobSeeker';
import RecruiterType from '@/types/recruiter';
import { useTranslations } from 'next-intl';
import { FaLock, FaUpload } from 'react-icons/fa6';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type AccountType = 'Admin' | 'Recruiter' | 'Jobseeker';

export const RCAccountComponent = ({
  data,
  type = 'Recruiter',
  openModel,
  getProfileImage,
}: {
  data: RecruiterType | JobSeekerType | undefined;
  type?: AccountType;
  openModel: (id: string) => void;
  getProfileImage: string;
}) => {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <>
      {' '}
      <div className="relative w-full h-56 bg-slate-50">
        <img
          src="/recruiter-auth.png"
          className="object-cover w-full h-full"
          alt=""
        />
      </div>
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <div className="relative pl-6 rounded-full -translate-y-2/4">
            <img
              src={
                data?.profileImageId
                  ? getProfileImage
                  : `https://www.w3schools.com/howto/img_avatar2.png`
              }
              className="object-cover w-40 h-40 border-4 border-white rounded-full"
            />
            {type === 'Recruiter' && (
              <div
                onClick={() => openModel('upload-profile-image-modal')}
                className="absolute p-2 transition-all rounded-full cursor-pointer bottom-2 right-2 bg-slate-200 hover:bg-slate-300"
              >
                <FaUpload className="text-xl text-slate-500" />
              </div>
            )}
          </div>
          <h2 className="flex-1 -mt-10 text-sm font-semibold lg:text-lg text-slate-700">
            {data?.name}
          </h2>
        </div>

        {type === 'Admin' && (
          <div className="-mt-10">
            <Button
              color="red"
              size="sm"
              disabled={data?.locked}
              className="ml-auto"
              onClick={() => openModel('delete-account')}
            >
              <FaLock className="mr-2" />
              {t('recruiter.profile.adminRole.lockAccount')}
            </Button>
          </div>
        )}
        {type === 'Jobseeker' && (
          <div className="-mt-10">
            <Button
              color={'red'}
              size={'sm'}
              disabled={data?.locked}
              className="ml-auto"
              onClick={() => openModel('delete-account-jobseeker')}
            >
              <FaLock className="mr-2" />
              {t('recruiter.profile.adminRole.lockAccount')}
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col -translate-y-10 gap-y-4">
        <div className="flex lg:items-center lg:gap-y-0 gap-y-4 lg:flex-row  flex-col gap-x-[155px]">
          <p className="text-lg font-semibold text-emerald-500">
            {t('recruiter.profile.title')}
          </p>
          <div className="flex items-center gap-x-2">
            <p>{t('recruiter.profile.status.title')}:</p>
            {session?.user.email && session?.user.name ? (
              <Badge variant="success" className="text-sm text-center">
                {t('recruiter.profile.status.completed')}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-sm text-center">
                {t('recruiter.profile.status.unCompleted')}
              </Badge>
            )}
          </div>
          {type === 'Recruiter' && (
            <div
              onClick={() => openModel('update-recruiter-info-modal')}
              className="px-2 py-1 text-sm text-center text-white transition-all rounded cursor-pointer lg:ml-auto bg-emerald-500 hover:bg-emerald-600"
            >
              {t('recruiter.profile.update.button')}
            </div>
          )}
          {type === 'Admin' && (
            <div className="flex ml-auto gap-x-2">
              {t('recruiter.profile.adminRole.accountStatus.label')}
              {!data?.locked ? (
                <Badge variant="success" className="px-2 text-sm">
                  {t('recruiter.profile.adminRole.accountStatus.normal')}
                </Badge>
              ) : (
                <Badge variant="destructive" className="px-2 text-sm">
                  {t('recruiter.profile.adminRole.accountStatus.locked')}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <hr className=" border-slate-200" />
          <div className="flex flex-col lg:flex-row">
            <table className="text-left">
              <tbody>
                <tr>
                  <th className="py-2">
                    {t('recruiter.profile.information.labelFullname')}:{' '}
                  </th>
                  <td className="py-2 lg:pl-44">{data?.name}</td>
                </tr>
                <tr>
                  <th className="py-2">Email: </th>
                  <td className="py-2 lg:pl-44">{data?.email}</td>
                </tr>
                <tr>
                  <th className="py-2">
                    {t('recruiter.profile.information.labelPhonenumber')}:{' '}
                  </th>
                  <td className="py-2 lg:pl-44">{data?.phone}</td>
                </tr>
                <tr>
                  <th className="py-2">
                    {t('recruiter.profile.information.labelCountry')}:{' '}
                  </th>
                  <td className="py-2 lg:pl-44">{data?.nation}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
