'use client';

import { differenceInDays, parse } from 'date-fns';
import { useSession } from 'next-auth/react';

import useIsInWishlist from '@/hooks/useIsInWishlist';

import Tag from '@/components/Tag';

import type PostType from '../types/post';
import businessService from '../services/businessService';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { Heart, HeartOff } from 'lucide-react';
import { Link, useRouter } from '@/navigation';

export default function Post({
  post,
  navigateTo,
}: {
  post: PostType;
  navigateTo: string;
}): JSX.Element {
  const t = useTranslations();

  const session = useSession();
  const role = session?.data?.user?.role;

  const { isInWishlist, addToWishlist } = useIsInWishlist(post.id);
  const router = useRouter();

  const remainingApplicationDays = differenceInDays(
    new Date(parse(post.applicationDeadline, 'dd/MM/yyyy', new Date())),
    new Date()
  );

  return (
    <div className="px-4 py-6 space-y-6 transition rounded md:space-y-4 md:px-6 bg-slate-100 hover:bg-slate-200">
      <div className="flex flex-col gap-4 md:gap-6 md:flex-row">
        <div className="flex justify-center flex-none">
          <img
            src={
              post.business.profileImageId
                ? businessService.getBusinessProfileImage(post.business.id)
                : '/business.png'
            }
            className="object-cover w-16 h-16 border-2 rounded border-slate-400"
          />
        </div>

        <div className="flex flex-col justify-between grow">
          <div className="flex flex-col items-center justify-between gap-2 sm:gap-4 sm:flex-row">
            <h4
              className="overflow-hidden text-lg font-bold grow"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              <Link
                className="transition-all cursor-pointer hover:text-emerald-500"
                href={`/posts/${post.id}`}
              >
                {post.title}
              </Link>
            </h4>

            <div className="flex items-center justify-between flex-none gap-6">
              <div className="font-semibold">
                {post.minSalaryString} - {post.maxSalaryString}
              </div>
              {role === 'JobSeeker' && (
                <div
                  className="text-xl transition cursor-pointer text-rose-500 hover:text-rose-700"
                  onClick={addToWishlist}
                >
                  {isInWishlist ? <Heart /> : <HeartOff />}
                </div>
              )}
              <Button onClick={() => router.push(navigateTo)} size="sm">
                {t('post.button.detail')}
              </Button>
            </div>
          </div>

          <div>
            <Link
              href={`/businesses/${post.business.id}`}
              className="hover:text-emerald-500 hover:underline opacity-80 hover:opacity-100"
            >
              {post.business.name}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 md:gap-0 sm:flex-row">
        <div className="flex flex-wrap justify-start gap-2 md:gap-4">
          {post.locations.map((location) => (
            <Tag key={location.provinceCode}>{location.provinceName}</Tag>
          ))}
          <Tag>{t('post.tag.new')}</Tag>
          <Tag>
            {t('post.tag.remainingDays', { number: remainingApplicationDays })}{' '}
          </Tag>
        </div>

        <div className="flex-none text-sm italic text-slate-600 text-end">
          {t('post.updatedOn', { date: '06/07/2023' })}
        </div>
      </div>
    </div>
  );
}
