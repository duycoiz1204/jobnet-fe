'use client';

import { useState, useEffect } from 'react';
import BusinessType from '@/types/business';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import postService from '@/services/postService';
import businessService from '@/services/businessService';
import jobSeekerService from '@/services/jobSeekerService';
import PostType from '@/types/post';
import { Button } from '../ui/button';
import { Link } from '@/navigation';
import { CirclePlus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function TopBusinessCard({
  data,
}: {
  data: BusinessType;
}): React.ReactElement {
  const t = useTranslations();

  const [totalJobsOfBusiness, setTotalJobsOfBusiness] = useState<PostType[]>();
  const session = useSession();
  const [follow, setFollow] = useState<boolean>(false);
  const jobSeekerId = session.data?.user?.id as string;

  useEffect(() => {
    void (async () => {
      const pagination = await postService.getPosts({
        businessId: data.id,
        activeStatus: 'Opening',
        isExpired: false,
      });
      setTotalJobsOfBusiness(pagination.data);
    })();
  }, [data.id]);

  useEffect(() => {
    if (jobSeekerId) {
      data.followers?.forEach((i) => {
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
        await jobSeekerService.updateJobSeekerBusinessFollowed(
          jobSeekerId,
          {
            status: 'FOLLOW',
            businessId: data.id,
          },
          session.data!!.accessToken!!
        );
        setFollow(true);
        toast.success(t('toast.follow.followed'));
      } catch (e) {
        console.log(e instanceof TypeError);

        if (e instanceof TypeError) {
          toast.error(`Something wrong!!! Reload page...`);
        }
      }
    })();
  };

  const handleUnFollowClick = () => {
    void (async () => {
      try {
        await jobSeekerService.updateJobSeekerBusinessFollowed(
          jobSeekerId,
          {
            status: 'UNFOLLOW',
            businessId: data.id,
          },
          session.data!!.accessToken!!
        );

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
    <div className="flex-none px-2 xl:px-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
      <div className="flex flex-col items-center gap-4 px-2 py-6 transition rounded xl:px-6 bg-slate-100 hover:bg-slate-200">
        <Image
          width={500}
          height={500}
          alt=""
          src={
            data.profileImageId
              ? businessService.getBusinessProfileImage(data.id)
              : '/business.png'
          }
          className="w-64 border-2 rounded h-36 border-slate-300"
        />
        <div className="flex flex-col items-center space-y-2">
          <div
            className="w-56 h-12 overflow-hidden font-bold cursor-pointer text-center"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            <Link
              href={`/businesses/${data.id}`}
              className="transition-all hover:text-emerald-500 hover:underline"
            >
              {data.name}
            </Link>
          </div>
          <div>
            {t('home.topLeadingBusinesses.totalPosts', {
              total: totalJobsOfBusiness?.length,
            })}
          </div>
          <div className="flex gap-4">
            {!follow ? (
              <Button onClick={() => handleFollowClick()}>
                <CirclePlus className="w-5 h-5 mr-2" />
                {t('home.topLeadingBusinesses.button.follow')}
              </Button>
            ) : (
              <Button variant={'red'} onClick={() => handleUnFollowClick()}>
                <CirclePlus className="w-5 h-5 mr-2" />
                {t('home.topLeadingBusinesses.button.unfollow')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
