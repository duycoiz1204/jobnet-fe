'use client'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { differenceInDays, parse } from 'date-fns'
import useIsInWishlist from '@/hooks/useIsInWishlist'


import type PostType from '@/types/post'
import businessService from '@/services/businessService'
import { useTranslations } from 'next-intl'
import { Link, redirect, usePathname, useRouter } from '@/navigation'
import { Button } from '@/components/ui/button'
import Tag from '@/components/Tag'
import { useSession } from 'next-auth/react'

export default function Post({
  post,
  navigateTo,
}: {
  post: PostType
  navigateTo: string
}): JSX.Element {
  const t = useTranslations()
  const session = useSession().data
  const role = session?.user?.role || ""
  const remainingApplicationDays = differenceInDays(
    new Date(parse(post.applicationDeadline, 'dd/MM/yyyy', new Date())),
    new Date()
  )
  const router = useRouter()
  const navigateToDetailPost = `${usePathname()}/${navigateTo}`
  
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
              {role === 'JobSeeker' && <HanleWishlist id={post.id}/> }
              <Button onClick={() => router.push(navigateToDetailPost)} size="sm">
                {t('post.button.detail')}
              </Button>
            </div>
          </div>

          <div>
            <Link
              href={`/businesses/${post.business.id}`}
              className="hover:text-emerald-500 hover:underline opacity-80 hover:opacity-100"
              // preventScrollReset={true}
            >
              {post.business.name}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 md:gap-0 sm:flex-row">
        <div className="flex flex-wrap justify-start gap-2 md:gap-4">
          {post.locations.map((location, index) => (
            <Tag key={index}>{location.provinceName}</Tag>
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
  )
}

function HanleWishlist({id}: {id: string}): JSX.Element {
  const { isInWishlist, addToWishlist } = useIsInWishlist(id)
  return (
    <div
      className="text-xl transition cursor-pointer text-rose-500 hover:text-rose-700"
      onClick={addToWishlist}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
    </div>
  )
}
