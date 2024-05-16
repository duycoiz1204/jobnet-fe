import postService from '@/services/postService';
import PostDetailsCpn from '@/app/(pages)/[lang]/(jobseeker)/posts/[id]/PostDetailsCpn';
import { Metadata } from 'next';
import applicationService from '@/services/applicationService';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: "Post Details",
    description: "Details for an job post on our website - Topcv"
};

export default async function PostDetails({ params }: { params: { id: string } }) {
    const _similarPostsPaginationData = await postService.getPosts({
        isExpired: false,
        activeStatus: 'Opening',
    });
    const post = await postService.getPostById(params.id);
    const session = await auth()
    const _isSubmitted = (session?.user.role) ? await applicationService.isSubmitted(params.id, session.accessToken) : false
    return (
        <PostDetailsCpn _similarPostsPaginationData={_similarPostsPaginationData} postId={params.id} post={post} _isSubmitted={_isSubmitted} />
    );
}