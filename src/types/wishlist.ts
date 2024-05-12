import Jobseeker from './jobSeeker';
import PostType from './post';

export default interface WishlistType {
  id: string;
  jobSeeker: Jobseeker;
  post: PostType;
  createdAt: string;
}
