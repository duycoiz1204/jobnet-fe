'use client';

import { useState, useEffect, ReactNode } from 'react';
import PostType from '@/types/post';
import Business from '@/types/business';
import { useTranslations } from 'next-intl';
import businessService from '@/services/businessService';
import {
  BookUser,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  Clock,
  Factory,
  LocateFixed,
  Lock,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import useIsInWishlist from '@/hooks/useIsInWishlist';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import Image from 'next/image';

function PostDetailsInfo({
  type = 'View',
  post,
  isSubmitted,
  openModal = () => undefined,
  handleClickUpdateHeading,
  handleClickUpdateGeneral,
  handleClickUpdateDetails,
}: {
  type?: 'View' | 'Update' | 'Admin' | 'Preview';
  post: PostType;
  isSubmitted?: boolean;
  openModal?: (id: string) => void;
  handleClickUpdateHeading?: () => void;
  handleClickUpdateGeneral?: () => void;
  handleClickUpdateDetails?: () => void;
}): React.ReactElement {
  const [business, setBusiness] = useState<Business>();
  const t = useTranslations();
  const { data: session } = useSession();

  useEffect(() => {
    void (async () => {
      const data = await businessService.getBusinessById(post.business.id);
      setBusiness(data);
    })();
  }, [post.business.id]);

  // const locationElms = post.business.locations.map((location, index) => (
  //   <p key={index}>
  //     {location.provinceName} - {location.specificAddress}
  //   </p>
  // ))

  return (
    <div className="space-y-4">
      <PostDetailsSection>
        <div className="col-span-1 p-6 border rounded bg-slate-50">
          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <Image
                width={500}
                height={500}
                alt=""
                src={businessService.getBusinessProfileImage(post.business?.id)}
                className="object-cover w-24 h-24 border rounded border-slate-200"
              />
              <h2 className="text-lg font-semibold">{post.business?.name}</h2>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-4">
                <div className="flex items-center gap-x-4">
                  <Users className="text-emerald-500" />
                  <span className="w-20 font-semibold">
                    {t('postDetails.BusinessInfor.scale.title')}:
                  </span>
                </div>
                <p>
                  {t('postDetails.BusinessInfor.scale.total', {
                    total: business?.employeeQuantity,
                  })}
                </p>
              </div>
              <div className="flex gap-x-4">
                <div className="flex items-center gap-x-4">
                  <LocateFixed className="text-emerald-500" />
                  <span className="w-20 font-semibold">
                    {t('postDetails.BusinessInfor.address')}:
                  </span>
                </div>
                {/* {locationElms} */}
              </div>
            </div>
            {type !== 'Preview' && (
              <Link
                href={`/businesses/${post.business?.id}`}
                className="font-semibold text-center text-emerald-500 hover:underline"
              >
                {t('postDetails.BusinessInfor.viewDetailBusiness')}
              </Link>
            )}
          </div>
        </div>

        <div className="p-6 col-span-2 h-[auto] border rounded bg-slate-50">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-xl font-bold">{post?.title}</h1>
            <div className="flex flex-col lg:items-center lg:flex-row gap-y-10 gap-x-4">
              <ItemPostHeading
                icon={<Factory />}
                title={t('postDetails.aboutJob.industry')}
                content={post?.profession?.name}
                size="large"
              />
              <ItemPostHeading
                icon={<CalendarClock />}
                title={t('postDetails.aboutJob.experience')}
                content={post?.yearsOfExperience}
                size="large"
              />
              <ItemPostHeading
                icon={<CircleDollarSign />}
                title={t('postDetails.aboutJob.salary')}
                content={`${post?.minSalaryString} - ${post?.maxSalaryString}`}
                size="large"
              />
              <ItemPostHeading
                icon={<BookUser />}
                title={t('postDetails.aboutJob.numberApply')}
                content={`${post?.requisitionNumber} người`}
                size="large"
              />
            </div>
            <span className="flex items-center px-2 mt-4 rounded w-60 gap-x-2 bg-slate-200">
              <Clock className="text-slate-400" />
              <span>
                {t('postDetails.aboutJob.appDeadline', {
                  deadline: post?.applicationDeadline,
                })}
              </span>
            </span>
            {type === 'Update' && (
              <Button
                className="ml-auto"
                variant={'emerald'}
                onClick={handleClickUpdateHeading}
              >
                Cập nhật
              </Button>
            )}
            {type !== 'Preview' && (
              <div className="flex items-center pt-4 gap-x-2">
                {type === 'View' && (
                  <Button
                    disabled={isSubmitted}
                    className="flex-1"
                    onClick={() => {
                      if (session?.user.id) {
                        openModal('application-modal');
                      } else {
                        toast(t('toast.signin.clickedButton'));
                      }
                    }}
                  >
                    {isSubmitted
                      ? t('postDetails.aboutJob.button.apply.js.applied')
                      : t('postDetails.aboutJob.button.apply.js.notApply')}
                  </Button>
                )}
                {type === 'Admin' && post.activeStatus === 'Pending' && (
                  <Button
                    className="w-40 ml-auto"
                    color={'warning'}
                    onClick={() => openModal('approval-post')}
                  >
                    Xét duyệt
                  </Button>
                )}
                {type === 'Admin' &&
                  !['Pending', 'Blocked', 'Rejected'].includes(
                    post.activeStatus
                  ) && (
                    <Button
                      className="w-40 ml-auto"
                      color={'red'}
                      onClick={() => openModal('lock-post-modal')}
                    >
                      <Lock className="mr-2" />
                      Khóa bài đăng
                    </Button>
                  )}

                {type === 'View' && (
                  <WishlistHanleCpm session={session} postId={post.id} />
                )}
              </div>
            )}
          </div>
        </div>
      </PostDetailsSection>

      <PostDetailsSection>
        <div
          className={cn('col-span-1 p-6 rounded', {
            'bg-slate-50 border h-auto':
              type === 'Update' || type === 'Preview',
            'bg-white': type !== 'Update',
          })}
        >
          <div className="flex items-center gap-x-4">
            <p className="h-8 w-[6px] bg-emerald-500"></p>
            <h1 className="text-lg font-semibold">
              {t('postDetails.requirements.title')}:
            </h1>
          </div>
          <div className="flex flex-col pt-4 gap-y-6">
            <ItemPostHeading
              icon={<ShieldCheck />}
              title={t('postDetails.requirements.degree')}
              // content={post.degrees?.map((item, index) => (
              //   <span key={index}>
              //     {item.name}
              //     {index !== post.degrees.length - 1 && ', '}
              //   </span>
              // ))}
              content=""
            />
            <ItemPostHeading
              icon={<Star />}
              title={t('postDetails.requirements.level')}
              content={post.level.name}
            />
            <ItemPostHeading
              icon={<BriefcaseBusiness />}
              title={t('postDetails.requirements.workForm')}
              content={post.workingFormat}
            />

            <ItemPostHeading
              icon={<Phone />}
              title={t('postDetails.requirements.contact')}
              // content={post.internalContact}
              content=""
            />
            <ItemPostHeading
              type="list"
              icon={<LocateFixed />}
              title={t('postDetails.requirements.location')}
              content={post.locations.map((location, index) => (
                <span key={index}>
                  {`${location.specificAddress}, ${location.provinceName}`}
                  {index !== post.locations.length - 1 && <br />}
                </span>
              ))}
            />
          </div>
          {type === 'Update' && (
            <div className="block float-right pt-6">
              <Button onClick={handleClickUpdateGeneral}>Cập nhật</Button>
            </div>
          )}
        </div>

        <div
          className={cn('w-full col-span-2 p-6', {
            'bg-slate-50 border': type === 'Update' || type === 'Preview',
            'bg-white': type !== 'Update',
          })}
        >
          <div className="flex items-center gap-x-4">
            <p className="h-8 w-[6px] bg-emerald-500"></p>
            <h2 className="text-xl font-bold">
              {t('postDetails.requirements.detail')}
            </h2>
          </div>
          <div className="flex flex-col gap-y-6">
            <div
              className="flex flex-col pt-4 gap-y-3"
              dangerouslySetInnerHTML={{ __html: post.description }}
            ></div>
            {type === 'View' && (
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center gap-x-4">
                  <p className="h-8 w-[6px] bg-emerald-500"></p>
                  <h3 className="text-lg font-semibold">
                    {t('postDetails.requirements.instructApply.title')}
                  </h3>
                </div>
                <p>{t('postDetails.requirements.instructApply.subTitle')}</p>
                <div className="flex items-center gap-x-2">
                  <Button
                    disabled={isSubmitted}
                    onClick={() => {
                      if (session?.user.id) {
                        openModal('application-modal');
                      } else {
                        toast(t('toast.signin.clickedButton'));
                      }
                    }}
                  >
                    {isSubmitted
                      ? t('postDetails.aboutJob.button.apply.js.applied')
                      : t('postDetails.aboutJob.button.apply.js.notApply')}
                  </Button>
                  <WishlistHanleCpm session={session} postId={post.id} />
                </div>
              </div>
            )}
            {type === 'Update' && (
              <div className="ml-auto">
                <Button onClick={handleClickUpdateDetails}>Cập nhật</Button>
              </div>
            )}
          </div>
        </div>
      </PostDetailsSection>
    </div>
  );
}

export default PostDetailsInfo;

export function PostDetailsSection({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-4 gap-y-2">
      {children}
    </div>
  );
}

type TypeShowItem = 'normal' | 'list';
export function ItemPostHeading({
  icon,
  title,
  content,
  type = 'normal',
  size,
}: {
  icon: ReactNode;
  title: string;
  content: React.ReactNode;
  type?: TypeShowItem;
  size?: string;
}) {
  return (
    <div
      className={cn('flex gap-x-4', {
        'items-start': type === 'list',
        'items-center': type !== 'list',
      })}
    >
      <span
        className={cn('text-white rounded-full bg-emerald-500', {
          'p-4': size === 'large',
          'p-3': size !== 'large',
        })}
      >
        {icon}
      </span>
      <div
        className={cn('flex flex-col translate-y-0', {
          'translate-y-2': type === 'list',
        })}
      >
        <p className="font-semibold">{title}</p>
        <p
          className={cn('font-normal', {
            'pt-2 -translate-x-2': type === 'list',
          })}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

function WishlistHanleCpm({
  postId,
  session,
}: {
  postId: string;
  session: Session | null;
}) {
  const t = useTranslations();
  const { isInWishlist, addToWishlist } = useIsInWishlist(
    postId,
    session?.accessToken!
  );

  return isInWishlist ? (
    <Button
      className={cn('border flex-2', {
        'text-white bg-rose-500 hover:border-rose-600': isInWishlist,
        'border-emerald-500 hover:border-emerald-600 hover:bg-slate-100':
          !isInWishlist,
      })}
      variant={'empty'}
      onClick={addToWishlist}
    >
      {!isInWishlist
        ? t('postDetails.aboutJob.button.save')
        : t('postDetails.aboutJob.button.unsave')}
    </Button>
  ) : (
    <Button
      className="border-emerald-500 hover:border-emerald-600 hover:bg-slate-100"
      variant={'empty'}
      onClick={() => {
        toast(t('toast.signin.clickedButton'));
      }}
    >
      {t('postDetails.aboutJob.button.save')}
    </Button>
  );
}
