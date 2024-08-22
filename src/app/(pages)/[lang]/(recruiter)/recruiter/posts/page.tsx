'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { FaClock, FaGear } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/input/InputWithLabel';
import Pagination from '@/components/Pagination';
import { Link, useRouter } from '@/navigation';
import Tabs from '@/components/Tabs';
import Dropdown from '@/components/Dropdown';

import postService from '@/services/postService';
import { cn } from '@/lib/utils';

import PostType, { PostActiveStatus } from '@/types/post';
import ErrorType from '@/types/error';
import usePagination from '@/hooks/usePagination';

export default function PostManagement(): JSX.Element {
  const { data: session } = useSession();
  const recruiterId = session?.user.id!!;
  const t = useTranslations();

  const [criteria, setCriteria] = useState({
    search: '',
    activeStatus: undefined as PostActiveStatus | undefined,
    fromDate: '',
    toDate: '',
  });

  const { pagination, setPagination, scrollIntoView, scrollIntoViewRef } =
    usePagination<PostType>(undefined!!);

  useEffect(() => {
    (async () => {
      const pagination = await postService.getPosts({
        recruiterId,
      });
      setPagination(pagination);
    })();
  }, [recruiterId, setPagination]);

  const handleCriteriaInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCriteria((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearchClick = () => {
    void (async () => {
      try {
        const pagination = await postService.getPosts({
          recruiterId,
          ...criteria,
        });
        setPagination(pagination);
      } catch (err) {
        console.error((err as ErrorType).message);
      }
    })();
  };

  const handleTabClick = (activeStatus?: PostActiveStatus) => {
    void (async () => {
      try {
        const pagination = await postService.getPosts({
          recruiterId,
          activeStatus,
        });
        setPagination(pagination);
        setCriteria({
          search: '',
          activeStatus,
          fromDate: '',
          toDate: '',
        });
      } catch (err) {
        console.error((err as ErrorType).message);
      }
    })();
  };

  const handlePageChange = (page: number) => {
    void (async () => {
      try {
        const pagination = await postService.getPosts({
          recruiterId,
          page,
          ...criteria,
        });
        setPagination(pagination);
      } catch (err) {
        console.error((err as ErrorType).message);
      }
    })();
  };

  const handlePostActiveStatusUpdate = (
    postId: string,
    activeStatus: PostActiveStatus
  ) => {
    void (async () => {
      try {
        await postService.updatePostStatus(
          postId,
          activeStatus,
          session?.accessToken!
        );
        const _pagination = await postService.getPosts({
          recruiterId,
          page: pagination.currentPage,
          ...criteria,
        });
        setPagination(_pagination);
        toast.success(t('recruiter.postManagement.action.update.success'));
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  const postElms = pagination?.data.map((post: PostType) => (
    <JobItem
      key={post.id}
      post={post}
      onPostActiveStatusUpdate={handlePostActiveStatusUpdate}
    />
  ));

  return (
    <main className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {t('recruiter.postManagement.title')}
        </h2>
        <div className="font-semibold text-slate-500">
          {t('recruiter.postManagement.subTitle')}
        </div>
        <Link href={'../../recruiter/posts/new'} className="block mt-6">
          <Button size="sm">
            {t('recruiter.postManagement.button.createPost')}
          </Button>
        </Link>
      </div>
      <div className="flex flex-col justify-between lg:flex lg:items-center lg:flex-row lg:gap-0 gap-y-4">
        <div className="flex lg:flex-row flex-col items-center lg:gap-4 lg:w-[700px] w-full">
          <InputWithLabel
            id="search"
            name="search"
            label={t('recruiter.postManagement.inputs.search.label')}
            type="text"
            color="emerald"
            placeholder={t(
              'recruiter.postManagement.inputs.search.placeholder'
            )}
            value={criteria.search}
            onChange={handleCriteriaInputChange}
          />
          <InputWithLabel
            id="fromDate"
            name="fromDate"
            label={t('recruiter.postManagement.inputs.fromDate.label')}
            type="date"
            color="emerald"
            value={criteria.fromDate}
            onChange={handleCriteriaInputChange}
          />
          <InputWithLabel
            id="toDate"
            name="toDate"
            label={t('recruiter.postManagement.inputs.toDate.label')}
            type="date"
            color="emerald"
            value={criteria.toDate}
            onChange={handleCriteriaInputChange}
          />
        </div>
        <div className="pt-7">
          <Button onClick={handleSearchClick}>
            <FaSearch className="w-4 h-4 mr-2" />
            {t('recruiter.postManagement.button.search')}
          </Button>
        </div>
      </div>
      <Tabs>
        <Tabs.Item
          title={t('recruiter.postManagement.tab.all')}
          onTabClick={() => handleTabClick()}
        />
        <Tabs.Item
          title={t('recruiter.postManagement.tab.open')}
          onTabClick={() => handleTabClick('Opening')}
        />
        <Tabs.Item
          title={t('recruiter.postManagement.tab.pending')}
          onTabClick={() => handleTabClick('Pending')}
        />
        <Tabs.Item
          title={t('recruiter.postManagement.tab.stop')}
          onTabClick={() => handleTabClick('Stopped')}
        />
        <Tabs.Item title={t('recruiter.postManagement.tab.expire')} />
      </Tabs>
      <div className="grid w-full grid-cols-2 gap-5">
        {postElms?.length ? (
          postElms
        ) : (
          <div className="pl-4 text-2xl">
            {t('recruiter.postManagement.noData')}
          </div>
        )}
      </div>
      <Pagination
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

function JobItem({
  post,
  onPostActiveStatusUpdate,
}: {
  post: PostType;
  onPostActiveStatusUpdate: (
    postId: string,
    activeStatus: PostActiveStatus
  ) => void;
}): JSX.Element {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="p-4 space-y-4 rounded-lg bg-slate-100">
      <div className="flex items-baseline justify-between">
        <h2
          className="text-xl font-bold truncate cursor-pointer w-96 hover:text-emerald-500"
          onClick={() => router.push(`../../posts/${post.id}`)}
        >
          {post.title}
        </h2>
        <Dropdown
          render={
            <Button size="lg">
              <FaGear className="w-4 h-4 mr-1" />
              {t('recruiter.postManagement.jobItem.button.custom')}
            </Button>
          }
          position="bottomRight"
          width="w-[200px]"
        >
          <Dropdown.Item
            disabled={post.activeStatus === 'Stopped'}
            onItemClick={() => onPostActiveStatusUpdate(post.id, 'Stopped')}
          >
            {t('recruiter.postManagement.jobItem.dropdown.stop')}
          </Dropdown.Item>
          <Dropdown.Item
            disabled={post.activeStatus === 'Opening'}
            onItemClick={() => onPostActiveStatusUpdate(post.id, 'Opening')}
          >
            {t('recruiter.postManagement.jobItem.dropdown.continue')}
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 ">
            <div className="font-semibold">
              {t('recruiter.postManagement.jobItem.status')}:
            </div>
            <div
              className={cn('px-2 text-white rounded-lg', {
                'bg-emerald-500': post.activeStatus === 'Opening',
                'bg-yellow-500': post.activeStatus === 'Pending',
                'bg-red-500': post.activeStatus === 'Stopped',
              })}
            >
              {post.activeStatus}
            </div>
          </div>
          <div>
            <span className="font-semibold">
              {t('recruiter.postManagement.jobItem.view')}:
            </span>{' '}
            {post.totalViews}
          </div>
          <div>
            <span className="font-semibold">
              {t('recruiter.postManagement.jobItem.apply')}:
            </span>{' '}
            {post.totalApplications}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <FaClock className="text-emerald-500" />
            <p className="text-sm italic text-slate-800">
              <span className="font-semibold">
                {t('recruiter.postManagement.jobItem.createAt')}:{' '}
              </span>
              {post.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-emerald-500" />
            <p className="text-sm italic text-slate-800">
              <span className="font-semibold">
                {t('recruiter.postManagement.jobItem.applicationDeadline')}::{' '}
              </span>
              {post.applicationDeadline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
