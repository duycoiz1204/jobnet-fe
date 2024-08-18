import JobseekerType from './jobSeeker';
import PostType from './post';

export type ApplicationStatus = 'Submitted' | 'Reviewed' | 'Rejected' | 'Hired' | 'Canceled';

export default interface ApplicationType {
  id: string;
  post: PostType;
  jobSeeker: JobseekerType;
  resumeId: string;
  createdAt: string;
  applicationStatus: ApplicationStatus;
}
