'use client';
import { FaPlusCircle } from 'react-icons/fa';
import businessService from '../services/businessService';

import BusinessType from '../types/business';
import {
  FaEnvelope,
  FaLink,
  FaLocationDot,
  FaLock,
  FaPhone,
  FaUpload,
} from 'react-icons/fa6';
import jobSeekerService from '../services/jobSeekerService';
import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { ItemPostHeading } from '@/components/PostDetailsInfo';
import Image from 'next/image';

interface BusinessInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: 'view' | 'update' | 'admin';
  business: BusinessType;
  openModal?: (id: string) => void;
}

function BusinessInfo({
  className,
  mode = 'view',
  business,
  openModal = () => undefined,
}: BusinessInfoProps) {
  const t = useTranslations();

  const session = useSession().data;

  const jobSeekerId = (session?.user?.id as string) || '';
  const businessId = business.id;
  const [follow, setFollow] = useState<boolean>(false);

  useEffect(() => {
    if (jobSeekerId) {
      business.followers?.forEach((i) => {
        if (i == jobSeekerId) {
          setFollow(true);
        }
      });
    }
  }, []);

  const handleFollowClick = () => {
    void (async () => {
      if (!jobSeekerId) {
        toast.error('Error: You need to Login');
        return;
      }
      try {
        const jobSeekerRes =
          await jobSeekerService.updateJobSeekerBusinessFollowed(
            jobSeekerId,
            {
              status: 'FOLLOW',
              businessId: businessId,
            },
            session!!.accessToken!!
          );

        setFollow(true);
        toast.success(t('toast.follow.followed'));
      } catch (e) {
        if (e instanceof TypeError) {
          toast.error(`Something wrong!!! Reload page...`);
        }
      }
    })();
  };

  const handleUnFollowClick = () => {
    void (async () => {
      try {
        const jobSeekerRes =
          (await jobSeekerService.updateJobSeekerBusinessFollowed(
            jobSeekerId,
            {
              status: 'UNFOLLOW',
              businessId: businessId,
            },
            session!!.accessToken!!
          )) || undefined;
        setFollow(false);
        toast.success(t('toast.follow.unfollow'));
      } catch (e) {
        if (e instanceof TypeError) {
          toast.error(`Something wrong!!! Reload page...`);
        }
      }
    })();
  };
  return (
    <div className={clsx(className, 'space-y-4')}>
      <div>
        <div className="relative h-56">
          <Image
            width={undefined}
            height={undefined}
            alt=""
            src={businessService.getBusinessBackgroundImage(business.id)}
            className="object-cover w-full h-full rounded-t"
          />
          {mode === 'update' && (
            <div
              onClick={() => openModal('background-image-upload-modal')}
              className="absolute bottom-0 right-0 p-2 text-sm font-semibold text-white transition-all rounded-tl cursor-pointer hover:bg-emerald-600 bg-emerald-500"
            >
              Cập nhật ảnh bìa
            </div>
          )}
        </div>
        <div className="relative flex flex-col items-center gap-8 p-8 border rounded-b lg:flex-row bg-slate-100">
          {mode === 'update' ? (
            <div className="relative">
              <Image
                width={undefined}
                height={undefined}
                alt=""
                src={businessService.getBusinessProfileImage(business.id)}
                className="object-center h-40 border-2 w-44 border-slate-200"
              />
              <div
                onClick={() => openModal('profile-image-upload-modal')}
                className="absolute bottom-0 right-0 p-2 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-600"
              >
                <FaUpload className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <div>
              <Image
                width={undefined}
                height={undefined}
                alt=""
                src={businessService.getBusinessProfileImage(business.id)}
                className="object-cover w-40 h-40 rounded-full"
              />
            </div>
          )}

          <div className="grow">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">{business.name}</h4>
              {mode === 'view' && (
                <div className="flex gap-4">
                  {!follow ? (
                    <Button
                      variant={'emerald'}
                      onClick={() => handleFollowClick()}
                    >
                      <FaPlusCircle className="w-5 h-5 mr-2" />
                      {t('businessDetail.businessInfo.btnFollow.follow')}
                    </Button>
                  ) : (
                    <Button
                      variant={'red'}
                      onClick={() => handleUnFollowClick()}
                    >
                      <FaPlusCircle className="w-5 h-5 mr-2" />
                      {t('businessDetail.businessInfo.btnFollow.unfollow')}
                    </Button>
                  )}
                </div>
              )}

              {mode === 'admin' && (
                <Button
                  color={'red'}
                  size={'sm'}
                  disabled={business?.isDeleted}
                  className="absolute right-[40px]"
                  onClick={() => openModal('modal-lock-account')}
                >
                  <FaLock className="mr-2" />
                  {t('recruiter.profile.adminRole.lockAccount')}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-2">
              <div className="flex">
                <div className="font-semibold">
                  {t('businessDetail.businessInfo.type')}:
                </div>
                <div className="ml-4">{business.type}</div>
              </div>
              <div className="flex">
                <div className="font-semibold">
                  {t('businessDetail.businessInfo.region')}:
                </div>
                <div className="ml-4">{business.country}</div>
              </div>
              <div className="flex">
                <div className="font-semibold">
                  {t('businessDetail.businessInfo.scale.title')}:
                </div>
                <div className="ml-4">
                  {t('businessDetail.businessInfo.scale.total', {
                    total: business.employeeQuantity,
                  })}
                </div>
              </div>
              <div className="flex">
                <div className="font-semibold">
                  {t('businessDetail.businessInfo.foundedYear')}:
                </div>
                <div className="ml-4">{business.foundedYear}</div>
              </div>
            </div>
          </div>
          {mode === 'update' && (
            <div
              onClick={() => openModal('general-info-update-modal')}
              className="absolute bottom-0 right-0 p-2 text-sm font-semibold text-white transition-all rounded-tl cursor-pointer hover:bg-emerald-600 bg-emerald-500"
            >
              {t('recruiter.business.updatebusinessInfo')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0 gap-y-4">
        <div className="col-span-2 border rounded bg-slate-100">
          <div className="p-6 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-4">
                <p className="h-8 w-[6px] bg-emerald-500"></p>
                <div className="text-lg font-bold">
                  {t('businessDetail.businessInfo.descBusiness')}
                </div>
              </div>
              {mode === 'update' && (
                <Button
                  size="sm"
                  onClick={() => openModal('introduction-info-update-modal')}
                >
                  {t('recruiter.business.editDescription')}
                </Button>
              )}
            </div>
            {business.description ? (
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: business.description }}
              />
            ) : (
              <div className="flex items-center justify-center h-24 text-2xl">
                {t('recruiter.business.emptyInfo')}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col border rounded gap-y-3 bg-slate-100">
          <div className="flex flex-col p-6 rounded gap-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-4">
                <p className="h-8 w-[6px] bg-emerald-500"></p>
                <div className="text-lg font-bold">
                  {t('businessDetail.businessInfo.contact.title')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <ItemPostHeading
                icon={<FaEnvelope />}
                title="Email"
                content={business.emailDomain || 'trongduc@gmail.com'}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <ItemPostHeading
                icon={<FaPhone />}
                title={t('businessDetail.businessInfo.contact.phone')}
                content={business.phone || '0355852444'}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <ItemPostHeading
                icon={<FaLink />}
                title="Website"
                content={
                  <Link
                    href="#"
                    className="transition-all cursor-pointer hover:underline hover:text-emerald-500"
                  >
                    {business.website}
                  </Link>
                }
              />
            </div>
            <div className="pb-4 space-y-2">
              <ItemPostHeading
                type="list"
                icon={<FaLocationDot />}
                title={t('businessDetail.businessInfo.contact.address')}
                content={business.locations?.map((location, i) => (
                  <li key={i}>
                    {location.specificAddress} - {location.provinceName}
                  </li>
                ))}
              />
            </div>
            {mode === 'update' && (
              <Button
                size="sm"
                onClick={() => openModal('contact-info-update-modal')}
              >
                {t('recruiter.business.updateContact')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfo;
