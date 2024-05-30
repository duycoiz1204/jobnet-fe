import ADPostTable from '@/components/table/ADPostTable';
import postService from '@/services/postService';
import PaginationType from '@/types/pagination';
import PostType, { PostActiveStatus } from '@/types/post';

interface PostLoader {
  posts: PaginationType<PostType>;
  PostPageParam: object;
  col: Record<string, boolean>;
  status?: PostActiveStatus | undefined;
}
const PostPageParam = {
  posts: {},
  postsPending: { isExpired: 'false', activeStatus: 'Pending' },
  postsOpening: { isExpired: 'false', activeStatus: 'Opening' },
  postsExpired: { isExpired: 'true', activeStatus: 'Opening,Stopped,Closed' },
  postsBlocked: { activeStatus: 'Blocked' },
};

const columns: Record<string, boolean> = {
  search: true,
  businessName: true,
  recruiterName: true,
  totalViews: true,
  salary: true,
  applicationDeadline: true,
  activeStatus: true,
  action: true,
};

const initTable = async (type: string) => {
  if (type === 'pending') {
    const postsPending = await postService.getPosts({
      isExpired: false,
      activeStatus: 'Pending',
    });
    return {
      posts: postsPending,
      status: 'Pending',
      PostPageParam: PostPageParam.postsPending,
      col: {
        ...columns,
        activeStatus: false,
        recruiterName: false,
        totalViews: false,
      },
    };
  } else if (type === 'opening') {
    const postsPending = await postService.getPosts({
      isExpired: false,
      activeStatus: 'Opening',
    });
    return {
      posts: postsPending,
      status: 'Opening',
      PostPageParam: PostPageParam.postsOpening,
      col: { ...columns, activeStatus: false, recruiterName: false },
    };
  } else if (type === 'expired') {
    const postsExpired = await postService.getPosts({
      page: 1,
      isExpired: true,
      activeStatus: 'Opening,Stopped,Closed',
    });
    return {
      posts: postsExpired,
      status: 'Closed',
      PostPageParam: PostPageParam.postsExpired,
      col: { ...columns },
    };
  } else if (type === 'blocked') {
    const postsBlocked = await postService.getPosts({
      page: 1,
      activeStatus: 'Blocked',
    });
    return {
      posts: postsBlocked,
      status: 'Blocked',
      PostPageParam: PostPageParam.postsBlocked,
      col: { ...columns },
    };
  }
  const posts = await postService.getPosts({ page: 1 });

  return {
    posts: posts,
    status: undefined,
    PostPageParam: PostPageParam.posts,
    col: { ...columns, recruiterName: false },
  };
};

// type can be: all, opened, pending, expired, blocked

export default async function ADPost({ params }: { params: { type: string } }) {
  const data = await initTable(params.type);

  return (
    <ADPostTable
      loaderData={data.posts}
      {...data.PostPageParam}
      col={data.col}
      status={data.status as PostActiveStatus}
    />
  );
}
