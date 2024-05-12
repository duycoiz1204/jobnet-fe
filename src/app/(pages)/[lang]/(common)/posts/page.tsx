'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { FolderSearch, Search } from 'lucide-react';
import Selection, { SelectChangeEvent } from '@/components/select/Selection';
import EmptyData from '@/components/EmptyData';
import Pagination from '@/components/Pagination';
import Post from '@/components/Post';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import categoryService from '@/services/categoryService';
import professionService from '@/services/professionService';
import postService from '@/services/postService';
import usePagination from '@/hooks/usePagination';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { setLoading } from '@/lib/features/loading/loadingSlice';

type Props = {};

const categories = await categoryService.getCategories();
const professions = await professionService.getProfessions();
const paginationData = await postService.getPosts({
  search: '',
});

export default function Posts({}: Props) {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { pagination, setPagination, scrollIntoView, scrollIntoViewRef } =
    usePagination(paginationData);

  const [criteria, setCriteria] = useState({
    search: '',
    categoryId: '',
    professionId: '',
    minSalary: '',
    maxSalary: '',
    provinceName: '',
    workingFormat: '',
    sortBy: 'createdAt-desc',
  });

  const filteredProfessions = criteria.categoryId
    ? professions.filter(
        (profession) => profession.categoryId === criteria.categoryId
      )
    : professions;

  const handlePageChange = (page: number) => {
    void (async () => {
      dispatch(setLoading(true));

      try {
        const pagination = await postService.getPosts({
          page,
          ...criteria,
          minSalary: parseInt(criteria.minSalary),
          maxSalary: parseInt(criteria.maxSalary),
          provinceName: criteria.provinceName,
          sortBy: [criteria.sortBy],
          activeStatus: 'Opening',
          isExpired: false,
        });
        setPagination(pagination);
        scrollIntoView();
      } catch (err) {
        console.error(err);
        toast.error('An error occured.');
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleCriteriaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) =>
      setCriteria((prevCriteria) => ({
        ...prevCriteria,
        [e.target.name]: e.target.value,
      })),
    []
  );

  const handleFindJobs = () => {
    void (async () => {
      dispatch(setLoading(true));

      try {
        const pagination = await postService.getPosts({
          ...criteria,
          minSalary: parseInt(criteria.minSalary),
          maxSalary: parseInt(criteria.maxSalary),
          provinceName: criteria.provinceName,
          sortBy: undefined,
          activeStatus: 'Opening',
          isExpired: false,
        });
        setPagination(pagination);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleSortByChange = (e: SelectChangeEvent) => {
    const sortBy = e.target.value;
    console.log(sortBy);

    sortBy &&
      void (async () => {
        dispatch(setLoading(true));
        try {
          const pagination = await postService.getPosts({
            ...criteria,
            minSalary: parseInt(criteria.minSalary),
            maxSalary: parseInt(criteria.maxSalary),
            provinceName: criteria.provinceName,
            sortBy: [sortBy],
            activeStatus: 'Opening',
            isExpired: false,
          });
          setPagination(pagination);
          setCriteria((prev) => ({ ...prev, sortBy }));
        } catch (err) {
          console.error(err);
          toast.error('An error occured.');
        } finally {
          dispatch(setLoading(false));
        }
      })();
  };

  const postSearchResultElms = pagination?.data.map((post) => (
    <Post key={post.id} post={post} navigateTo={post.id} />
  ));

  return (
    <div className="py-8 pt-20 space-y-8">
      <div className="flex justify-center py-12 bg-slate-200">
        <div className="w-[1200px] gap-y-6 flex flex-col">
          <div className="flex gap-x-4">
            <div className="basis-1/2">
              <InputSection
                htmlFor="search"
                label={t('posts.input.search.label')}
              >
                <div className="relative flex items-center">
                  <Search className="absolute w-4 h-4 left-2.5" />
                  <input
                    id="search"
                    name="search"
                    type="text"
                    className="h-10 pl-8 text-sm rounded-lg border-emerald-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 grow placeholder:text-slate-400"
                    placeholder={t('posts.input.search.placeholder')}
                    value={criteria.search}
                    onChange={handleCriteriaChange}
                  />
                </div>
              </InputSection>
            </div>
            <div className="flex items-end basis-1/2 gap-x-4">
              <InputSection
                label={t('posts.select.category.label')}
                className="grow"
              >
                <Selection
                  id="categoryId"
                  name="categoryId"
                  className="bg-white"
                  placeholder={t('posts.select.category.placeholder')}
                  options={categories}
                  value={criteria.categoryId}
                  onSelectChange={handleCriteriaChange}
                />
              </InputSection>
              <InputSection
                label={t('posts.select.profession.label')}
                className="grow"
              >
                <Selection
                  id="professionId"
                  name="professionId"
                  className="flex-1 bg-white"
                  placeholder={t('posts.select.profession.placeholder')}
                  options={filteredProfessions}
                  value={criteria.professionId}
                  onSelectChange={handleCriteriaChange}
                />
              </InputSection>
              <Button onClick={handleFindJobs}>
                {t('posts.button.search')}
              </Button>
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="basis-1/2">
              <InputSection label={t('posts.input.salary.label')}>
                <div className="flex items-center gap-x-2">
                  <Input
                    id="minSalary"
                    name="minSalary"
                    color="emerald"
                    placeholder={t('posts.input.salary.placeholder.min')}
                    value={criteria.minSalary}
                    onChange={handleCriteriaChange}
                  />
                  {'-'}
                  <Input
                    id="maxSalary"
                    name="maxSalary"
                    color="emerald"
                    placeholder={t('posts.input.salary.placeholder.max')}
                    value={criteria.maxSalary}
                    onChange={handleCriteriaChange}
                  />
                </div>
              </InputSection>
            </div>
            <div className="flex gap-4 basis-1/2">
              <InputSection
                label={t('posts.select.location.label')}
                className="grow"
              >
                <Selection
                  id="provinceName"
                  name="provinceName"
                  className="flex-1 bg-white"
                  placeholder={t('posts.select.location.placeholder')}
                  // options={mappedLocations}
                  value={criteria.provinceName}
                  onSelectChange={handleCriteriaChange}
                />
              </InputSection>
              <InputSection
                label={t('posts.select.workingFormat.label')}
                className="grow"
              >
                <Selection
                  id="workingFormat"
                  name="workingFormat"
                  className="flex-1 bg-white"
                  placeholder={t('posts.select.workingFormat.placeholder')}
                  options={[
                    { id: 'full-time', name: 'Full-time' },
                    { id: 'part-time', name: 'Part-time' },
                    { id: 'intern', name: 'Intern' },
                  ]}
                  value={criteria.workingFormat}
                  onSelectChange={handleCriteriaChange}
                />
              </InputSection>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollIntoViewRef} className="flex justify-center">
        <div className="w-[1200px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl">
                  <FolderSearch />
                </div>
                <div className="ml-2 font-semibold">
                  {t('posts.results.total')}{' '}
                  <span className="underline text-emerald-500">
                    {pagination.totalElements}
                  </span>{' '}
                  {t('posts.results.jobs')}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold" htmlFor="sortBy">
                  {t('posts.select.sortBy.label')}
                </label>
                <Selection
                  id="sortBy"
                  name="sortBy"
                  className="w-44"
                  placeholder={t('posts.select.sortBy.placeholder')}
                  options={[
                    {
                      id: 'createdAt-desc',
                      name: t('posts.select.sortBy.option.latest'),
                    },
                    {
                      id: 'salary-desc',
                      name: t('posts.select.sortBy.option.highestSalary'),
                    },
                    // { id: '', name: 'Cập nhật gần đây' },
                  ]}
                  value={criteria.sortBy}
                  onSelectChange={handleSortByChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              {postSearchResultElms.length ? (
                postSearchResultElms
              ) : (
                <EmptyData />
              )}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputSection({
  label,
  htmlFor,
  className,
  children,
}: {
  htmlFor?: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <label htmlFor={htmlFor} className="font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}