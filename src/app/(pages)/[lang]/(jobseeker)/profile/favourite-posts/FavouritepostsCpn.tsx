'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Link, useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { differenceInDays } from 'date-fns';
import { setLoading } from '@/features/loading/loadingSlice';
import usePagination from '@/hooks/usePagination';

import { Button } from '@/components/ui/button';
import Tag from '@/components/Tag';
import Selection, { SelectChangeEvent } from '@/components/select/Selection';

import wishlistService from '@/services/wishlistService';

import PostType from '@/types/post';
import { toast } from 'sonner';
import ErrorType from '@/types/error';
import { FileSearch } from 'lucide-react';
import EmptyData from '@/components/EmptyData';
import Pagination from '@/components/Pagination';
import WishlistType from '@/types/wishlist';
import { useAppDispatch } from '@/hooks/useRedux';
import PaginationType from '@/types/pagination';
import businessService from '@/services/businessService';

interface FavouritePostCpn {
    _wishlist: PaginationType<WishlistType>
}

export default function FavouritepostsCpn({
    _wishlist
}: FavouritePostCpn): React.ReactElement {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const { data: session } = useSession();

    const { pagination, setPagination, scrollIntoView, scrollIntoViewRef } =
        usePagination<WishlistType>(_wishlist);
    const [sortBy, setSortBy] = useState('createdAt-desc');


    const handlePageChange = (page: number) => {
        void (async () => {
            dispatch(setLoading(true));

            try {
                const pagination = await wishlistService.getWishlists({ page, accessToken: session!!.accessToken });
                setPagination(pagination);
                scrollIntoView();
            } catch (err) {
                console.error('An error occured.');
            } finally {
                dispatch(setLoading(false));
            }
        })();
    };

    const handleSortByChange = (e: SelectChangeEvent) => {
        const sortBy = e.target.value;
        void (async () => {
            dispatch(setLoading(true));

            try {
                const pagination = await wishlistService.getWishlists({
                    sortBy,
                    accessToken: session!!.accessToken
                });
                setPagination(pagination);
                setSortBy(sortBy);
            } catch (err) {
                console.error('An error occured.');
            } finally {
                dispatch(setLoading(false));
            }
        })();
    };

    const handleDeleteWishlist = async (postId: string) => {
        dispatch(setLoading(true));

        try {
            await wishlistService.deleteWishlist(postId, session?.accessToken!!);
            const pagination = await wishlistService.getWishlists({
                accessToken: session!!.accessToken
            });
            setPagination(pagination);
            toast.success(t('toast.post.save.unsave'));
        } catch (err) {
            toast.error((err as ErrorType).message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const favoriteJobsElms: JSX.Element[] = pagination.data.map((wishlist) => (
        <FavoriteJob
            key={wishlist.id}
            post={wishlist.post}
            handleDeleteWishlist={handleDeleteWishlist}
        />
    ));

    return (
        <main ref={scrollIntoViewRef}>
            <div className="flex flex-col gap-y-6">
                <div className="flex items-baseline justify-between">
                    <h1 className="text-xl font-bold leading-none">
                        {t('favoritePost.header.title')}
                    </h1>
                    <div className="flex items-baseline gap-4">
                        <label className="font-semibold" htmlFor="sortBy">
                            {t('favoritePost.filter.sort.title')}:
                        </label>
                        <Selection
                            id="sortBy"
                            name="sortBy"
                            className="w-40"
                            options={[
                                {
                                    id: 'createdAt-desc',
                                    name: t('favoritePost.filter.sort.recent'),
                                },
                                {
                                    id: 'salary-desc',
                                    name: t('favoritePost.filter.sort.topSalary'),
                                },
                            ]}
                            value={sortBy}
                            onSelectChange={handleSortByChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <div className="text-2xl">
                            <FileSearch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="ml-2 font-semibold">
                                {t('favoritePost.filter.title')}:{' '}
                                <span className="underline text-emerald-500">
                                    {t('favoritePost.filter.totalResult', {
                                        total: pagination.totalElements,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {favoriteJobsElms.length ? (
                        <div className="grid grid-cols-1 gap-4 mt-5 lg:grid-cols-2 ">
                            {favoriteJobsElms}
                        </div>
                    ) : (
                        <EmptyData />
                    )}

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </main>
    );
}

function FavoriteJob({
    post,
    handleDeleteWishlist,
}: {
    post: PostType;
    handleDeleteWishlist: (postId: string) => Promise<void>;
}): React.ReactElement {
    const router = useRouter();
    const t = useTranslations();
    const remainingApplicationDays = differenceInDays(
        new Date(post.applicationDeadline),
        new Date()
    );
    return (
        <div className="px-4 py-6 space-y-6 rounded-md bg-slate-100">
            <div className="flex items-center gap-4">
                <img
                    src={
                    post.business.profileImageId
                        ? businessService.getBusinessProfileImage(post.business.id)
                        : '/business.png'
                    }
                    className="object-cover w-16 h-16 border-2 rounded border-slate-400"
                />
                <div className="space-y-2 grow">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/posts/${post.id}`}
                            className="w-64 text-lg font-bold truncate hover:text-emerald-500 hover:underline"
                        >
                            {post.title}
                        </Link>
                        <span className="font-semibold">
                            {post.minSalaryString} - {post.maxSalaryString}
                        </span>
                    </div>
                    <div>
                        <Link
                            href={`/businesses/${post.business.id}`}
                            className="hover:text-emerald-500"
                        >
                            {post.business.name}
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-start gap-2 md:gap-4">
                <Tag>Quận 7, Tp HCM</Tag>
                <Tag>Mới</Tag>
                <Tag>Còn {remainingApplicationDays} ngày để ứng tuyển</Tag>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 md:gap-0 sm:flex-row">
                <div className="flex-none text-sm italic text-slate-600 text-end">
                    {t('favoritePost.post.updatedAt')}: 06/07/2023
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.push(`/posts/${post.id}`)} size="sm">
                        {t('favoritePost.post.button.detail')}
                    </Button>
                    <Button
                        variant="red"
                        size="sm"
                        onClick={() => void handleDeleteWishlist(post.id)}
                    >
                        {t('favoritePost.post.button.cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
