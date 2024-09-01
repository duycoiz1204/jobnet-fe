'use client';
import { useState, useEffect, useLayoutEffect } from 'react';
import postService from '@/services/postService';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import PostDetailsInfo from '@/components/PostDetailsInfo';
import { FileSearch } from 'lucide-react';
import Pagination from '@/components/Pagination';
import EmptyData from '@/components/EmptyData';
import ApplicationModal from '@/components/modal/ApplicationModal';
import { useTranslations } from 'next-intl';
import useModal from '@/hooks/useModal';
import PostType from '@/types/post';
import Post from '@/components/Post';
import usePagination from '@/hooks/usePagination';
import { toast } from 'sonner';
import { setLoading } from '@/features/loading/loadingSlice';
import PaginationType from '@/types/pagination';
import Selection from '@/components/select/Selection';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';

type PostDetailsProps = {
    _similarPostsPaginationData: PaginationType<PostType>,
    postId: string
    post: PostType
    _isSubmitted: boolean
}

export default function PostDetailsCpn({ _similarPostsPaginationData, postId, post, _isSubmitted}: PostDetailsProps) {

    const {
        pagination: similarPostsPagination,
        setPagination: setSimilarPostsPagination,
        scrollIntoView,
        scrollIntoViewRef,
    } = usePagination(_similarPostsPaginationData);

    const t = useTranslations();
    const dispatch = useAppDispatch();
    const [isSubmitted, setIsSubmitted] = useState<boolean>(_isSubmitted);
    const { modal, openModal, closeModal } = useModal();
    const session = useSession()

    useLayoutEffect(() => {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
        });
    }, [postId]);

    const handlePageChange = (page: number) => {
        void (async () => {
            dispatch(setLoading(true));

            try {
                const similarPostsPagination = await postService.getPosts({
                    page,
                    isExpired: false,
                    activeStatus: 'Opening',
                });
                setSimilarPostsPagination(similarPostsPagination);
                scrollIntoView();
            } catch (err) {
                toast.error('An error occurred.');
            } finally {
                dispatch(setLoading(false));
            }
        })();
    };

    const similarPostElms = similarPostsPagination.data.map((post) => (
        <Post key={post.id} post={post} />
    ));
    return (
        <div>
            <div className="px-20 pt-24 space-y-4 bg-slate-100">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href=".">Trang chủ</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">
                                Việc làm công nghệ thông tin
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>IT Engineer</BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="space-y-8">
                    {post && (
                        <PostDetailsInfo
                            post={post}
                            isSubmitted={isSubmitted}
                            openModal={openModal}
                        />
                    )}

                    <div ref={scrollIntoViewRef} className="flex justify-center">
                        <div className="w-[1200px] p-6 bg-white rounded">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-2xl">
                                            <FileSearch />
                                        </div>
                                        <div className="ml-2 font-semibold">
                                            {t('postDetails.requirements.sameJob')}:{' '}
                                            <span className="underline text-emerald-500">
                                                {similarPostsPagination.totalElements}
                                            </span>{' '}
                                            {t('postDetails.requirements.job')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="font-semibold" htmlFor="sortBy">
                                            {t('postDetails.requirements.sort.title')}:
                                        </label>
                                        <Selection
                                            id="sortBy"
                                            name="sortBy"
                                            className="w-44"
                                            options={[
                                                {
                                                    id: 'createdAt',
                                                    name: t('postDetails.requirements.sort.createAt'),
                                                },
                                                {
                                                    id: 'salary',
                                                    name: t('postDetails.requirements.sort.salary'),
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {similarPostElms.length ? similarPostElms : <EmptyData />}
                                </div>
                                <Pagination
                                    currentPage={similarPostsPagination.currentPage}
                                    totalPages={similarPostsPagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {post && (session?.data?.user.id) && (
                <ApplicationModal
                    modal={modal}
                    openModal={openModal}
                    closeModal={closeModal}
                    handleSubmitModal={() => {
                        setIsSubmitted(true)
                    }}
                    post={post}
                />
            )}
        </div>
    )
}